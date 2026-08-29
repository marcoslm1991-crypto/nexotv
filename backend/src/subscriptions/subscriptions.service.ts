import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RenewSubscriptionDto } from './dto/renew-subscription.dto';
import { ChangePlanDto } from './dto/change-plan.dto';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async renewSubscription(dto: RenewSubscriptionDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.user_id },
      include: {
        subscriptions: {
          orderBy: { created_at: 'desc' },
          take: 1,
          include: { plan: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario no encontrado`);
    }

    const currentSub = user.subscriptions[0];
    if (!currentSub) {
      throw new BadRequestException(`El usuario no cuenta con un registro de suscripción`);
    }

    const now = new Date();
    let newStartDate = new Date(currentSub.start_date);
    let baseEndDate = new Date(currentSub.end_date);

    // Si la suscripción ya estaba vencida, reiniciar fecha de inicio desde hoy
    if (baseEndDate < now) {
      newStartDate = now;
      baseEndDate = now;
    }

    const newEndDate = new Date(baseEndDate);
    newEndDate.setMonth(newEndDate.getMonth() + dto.months);

    const actionName = dto.months === 1 ? 'RENEWAL_1_MONTH' : 'RENEWAL_MULTI';

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Actualizar suscripción
      const updatedSub = await tx.subscription.update({
        where: { id: currentSub.id },
        data: {
          start_date: newStartDate,
          end_date: newEndDate,
          status: SubscriptionStatus.VIGENTE,
        },
        include: { plan: true },
      });

      // 2. Registrar en historial
      await tx.subscriptionHistory.create({
        data: {
          subscription_id: currentSub.id,
          user_id: user.id,
          plan_id: currentSub.plan_id,
          start_date: newStartDate,
          end_date: newEndDate,
          action: actionName,
          notes: dto.notes || `Renovación de ${dto.months} mes(es) por administración.`,
        },
      });

      // 3. Auditoría
      await tx.auditLog.create({
        data: {
          user_id: user.id,
          action: 'RENEW_SUBSCRIPTION',
          details: `Suscripción renovada ${dto.months} mes(es). Nueva fecha de vencimiento: ${newEndDate.toISOString()}`,
        },
      });

      return updatedSub;
    });

    return {
      message: 'Suscripción renovada exitosamente',
      subscription_id: result.id,
      user_id: result.user_id,
      plan: result.plan.name,
      new_end_date: result.end_date,
      status: result.status,
    };
  }

  async changePlan(dto: ChangePlanDto) {
    const newPlan = await this.prisma.plan.findUnique({
      where: { code: dto.new_plan_code.toUpperCase() },
    });

    if (!newPlan || !newPlan.is_active) {
      throw new BadRequestException(`El plan '${dto.new_plan_code}' no es válido o está inactivo`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: dto.user_id },
      include: {
        subscriptions: {
          orderBy: { created_at: 'desc' },
          take: 1,
        },
      },
    });

    if (!user || !user.subscriptions[0]) {
      throw new NotFoundException(`Suscripción de usuario no encontrada`);
    }

    const currentSub = user.subscriptions[0];

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedSub = await tx.subscription.update({
        where: { id: currentSub.id },
        data: { plan_id: newPlan.id },
        include: { plan: true },
      });

      await tx.subscriptionHistory.create({
        data: {
          subscription_id: currentSub.id,
          user_id: user.id,
          plan_id: newPlan.id,
          start_date: currentSub.start_date,
          end_date: currentSub.end_date,
          action: 'PLAN_CHANGE',
          notes: `Cambio de plan a '${newPlan.name}' (${newPlan.max_screens} pantallas).`,
        },
      });

      await tx.auditLog.create({
        data: {
          user_id: user.id,
          action: 'CHANGE_PLAN',
          details: `Plan cambiado a ${newPlan.name} (${newPlan.code})`,
        },
      });

      return updatedSub;
    });

    return {
      message: `Plan actualizado correctamente a ${result.plan.name}`,
      plan_code: result.plan.code,
      max_screens: result.plan.max_screens,
      max_profiles: result.plan.max_profiles,
    };
  }

  async getHistory(userId: string) {
    return this.prisma.subscriptionHistory.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }
}
