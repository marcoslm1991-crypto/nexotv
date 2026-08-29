import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SubscriptionStatus, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { alias: dto.alias },
    });

    if (existingUser) {
      throw new BadRequestException(`El usuario/alias '${dto.alias}' ya se encuentra registrado`);
    }

    const plan = await this.prisma.plan.findUnique({
      where: { code: dto.plan_code.toUpperCase() },
    });

    if (!plan || !plan.is_active) {
      throw new BadRequestException(`El plan '${dto.plan_code}' no existe o no está activo`);
    }

    // Hash de la contraseña con salt (bcrypt - OWASP)
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(dto.password, salt);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (dto.duration_months || 1));

    // Transacción atómica en PostgreSQL
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Crear Usuario
      const user = await tx.user.create({
        data: {
          alias: dto.alias,
          name: dto.name || dto.alias,
          password_hash,
          role: UserRole.CLIENT,
          is_active: true,
        },
      });

      // 2. Crear Suscripción inicial
      const subscription = await tx.subscription.create({
        data: {
          user_id: user.id,
          plan_id: plan.id,
          start_date: startDate,
          end_date: endDate,
          status: SubscriptionStatus.VIGENTE,
        },
      });

      // 3. Registrar en Historial
      await tx.subscriptionHistory.create({
        data: {
          subscription_id: subscription.id,
          user_id: user.id,
          plan_id: plan.id,
          start_date: startDate,
          end_date: endDate,
          action: 'CREATION',
          notes: `Alta inicial con ${dto.duration_months || 1} mes(es) contratado(s).`,
        },
      });

      // 4. Crear Perfil Principal inicial
      await tx.profile.create({
        data: {
          user_id: user.id,
          name: 'Perfil 1',
        },
      });

      // 5. Audit Log
      await tx.auditLog.create({
        data: {
          user_id: user.id,
          action: 'CREATE_USER',
          details: `Cliente '${user.alias}' creado con plan '${plan.name}'.`,
        },
      });

      return { user, subscription, plan };
    });

    return {
      id: result.user.id,
      alias: result.user.alias,
      name: result.user.name,
      role: result.user.role,
      plan: result.plan.name,
      subscription_end: result.subscription.end_date,
      status: result.subscription.status,
    };
  }

  async findAll(query?: { search?: string; status?: SubscriptionStatus; plan_code?: string }) {
    const whereClause: any = {
      role: UserRole.CLIENT,
    };

    if (query?.search) {
      whereClause.OR = [
        { alias: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        alias: true,
        name: true,
        is_active: true,
        created_at: true,
        subscriptions: {
          orderBy: { created_at: 'desc' },
          take: 1,
          include: { plan: true },
        },
        profiles: {
          select: { id: true, name: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return users.map((u) => {
      const activeSub = u.subscriptions[0];
      return {
        id: u.id,
        alias: u.alias,
        name: u.name,
        is_active: u.is_active,
        created_at: u.created_at,
        plan_name: activeSub?.plan?.name || 'N/A',
        plan_code: activeSub?.plan?.code || 'N/A',
        max_screens: activeSub?.plan?.max_screens || 0,
        subscription_status: activeSub?.status || 'SIN_SUSCRIPCION',
        end_date: activeSub?.end_date || null,
        profile_count: u.profiles.length,
      };
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        subscriptions: {
          orderBy: { created_at: 'desc' },
          include: { plan: true, history: true },
        },
        profiles: true,
        devices: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
    }

    return user;
  }
}
