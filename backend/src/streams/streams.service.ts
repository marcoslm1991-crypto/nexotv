import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthorizeStreamDto } from './dto/authorize-stream.dto';
import { HeartbeatStreamDto } from './dto/heartbeat-stream.dto';
import { StopStreamDto } from './dto/stop-stream.dto';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class StreamsService {
  private readonly HEARTBEAT_TIMEOUT_SECONDS = parseInt(process.env.STREAM_HEARTBEAT_TIMEOUT_SECONDS || '60', 10);

  constructor(private prisma: PrismaService) {}

  /**
   * Limpia reproducciones inactivas abandonadas (stale streams)
   */
  private async purgeStaleStreams(userId: string) {
    const threshold = new Date(Date.now() - this.HEARTBEAT_TIMEOUT_SECONDS * 1000);
    await this.prisma.activeStream.deleteMany({
      where: {
        user_id: userId,
        last_heartbeat: {
          lt: threshold,
        },
      },
    });
  }

  async authorizeStream(userId: string, dto: AuthorizeStreamDto) {
    // 1. Limpiar sesiones abandonadas primero
    await this.purgeStaleStreams(userId);

    // 2. Verificar usuario y suscripción activa
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          orderBy: { created_at: 'desc' },
          take: 1,
          include: { plan: true },
        },
        profiles: true,
      },
    });

    if (!user || !user.is_active) {
      throw new ForbiddenException('Usuario no autorizado o inactivo.');
    }

    const activeSub = user.subscriptions[0];

    if (!activeSub || activeSub.status === SubscriptionStatus.VENCIDO || activeSub.status === SubscriptionStatus.SUSPENDIDO) {
      throw new ForbiddenException('Tu suscripción está vencida o inactiva. Renovala para acceder al contenido.');
    }

    const plan = activeSub.plan;
    const maxScreens = plan.max_screens;

    // 3. Verificar que el perfil pertenezca al usuario
    const profile = user.profiles.find((p) => p.id === dto.profile_id);
    if (!profile) {
      throw new BadRequestException('El perfil seleccionado no pertenece a tu cuenta.');
    }

    // 4. Registrar o actualizar el dispositivo
    const device = await this.prisma.device.upsert({
      where: { device_uuid: dto.device_uuid },
      update: {
        device_name: dto.device_name,
        last_active: new Date(),
      },
      create: {
        user_id: userId,
        device_name: dto.device_name,
        device_uuid: dto.device_uuid,
        last_active: new Date(),
      },
    });

    // 5. Verificar si este mismo dispositivo ya tiene una reproducción activa
    const existingDeviceStream = await this.prisma.activeStream.findFirst({
      where: {
        user_id: userId,
        device_id: device.id,
      },
    });

    if (existingDeviceStream) {
      // Reutilizar la sesión existente en el mismo dispositivo
      const updatedStream = await this.prisma.activeStream.update({
        where: { id: existingDeviceStream.id },
        data: {
          profile_id: dto.profile_id,
          content_id: dto.content_id,
          last_heartbeat: new Date(),
        },
      });

      return {
        authorized: true,
        active_stream_id: updatedStream.id,
        max_screens: maxScreens,
        current_active_screens: (await this.prisma.activeStream.count({ where: { user_id: userId } })),
        message: 'Reproducción autorizada en este dispositivo',
      };
    }

    // 6. Contar reproducciones activas de otros dispositivos
    const currentActiveCount = await this.prisma.activeStream.count({
      where: { user_id: userId },
    });

    // 7. BLOQUEO SI SE ALCANZA EL LÍMITE DE PANTALLAS SIMULTÁNEAS
    if (currentActiveCount >= maxScreens) {
      let customErrorMessage = `Ya alcanzaste el límite de ${maxScreens} pantalla(s) simultánea(s) de tu ${plan.name}. Para continuar, cerrá la reproducción en uno de tus dispositivos.`;

      if (plan.code === 'FAMILIAR') {
        customErrorMessage = `Ya alcanzaste el límite de 3 pantallas simultáneas de tu Plan Familiar. Para continuar, cerrá la reproducción en uno de tus dispositivos o contratá el Plan Familiar Plus de hasta 5 pantallas.`;
      } else if (plan.code === 'INDIVIDUAL') {
        customErrorMessage = `Ya alcanzaste el límite de 1 pantalla simultánea de tu Plan Individual. Para continuar, cerrá la reproducción en tu otro dispositivo o contratá el Plan Familiar de hasta 3 pantallas.`;
      }

      throw new ForbiddenException({
        statusCode: 403,
        error: 'Forbidden',
        message: customErrorMessage,
        max_screens: maxScreens,
        current_active_screens: currentActiveCount,
      });
    }

    // 8. Registrar nueva reproducción simultánea activa
    const newStream = await this.prisma.activeStream.create({
      data: {
        user_id: userId,
        profile_id: dto.profile_id,
        device_id: device.id,
        content_id: dto.content_id,
        started_at: new Date(),
        last_heartbeat: new Date(),
      },
    });

    return {
      authorized: true,
      active_stream_id: newStream.id,
      max_screens: maxScreens,
      current_active_screens: currentActiveCount + 1,
      message: 'Reproducción autorizada exitosamente',
    };
  }

  async heartbeat(userId: string, dto: HeartbeatStreamDto) {
    const stream = await this.prisma.activeStream.findUnique({
      where: { id: dto.active_stream_id },
    });

    if (!stream || stream.user_id !== userId) {
      throw new NotFoundException('Sesión de reproducción no encontrada o expirada.');
    }

    await this.prisma.activeStream.update({
      where: { id: dto.active_stream_id },
      data: { last_heartbeat: new Date() },
    });

    return { success: true, timestamp: new Date() };
  }

  async stopStream(userId: string, dto: StopStreamDto) {
    const stream = await this.prisma.activeStream.findUnique({
      where: { id: dto.active_stream_id },
    });

    if (!stream) {
      return { success: true, message: 'La sesión ya se encontraba liberada.' };
    }

    if (stream.user_id !== userId) {
      throw new ForbiddenException('No tienes permiso para detener esta sesión.');
    }

    await this.prisma.activeStream.delete({
      where: { id: dto.active_stream_id },
    });

    return { success: true, message: 'Pantalla liberada correctamente.' };
  }

  async getActiveStreamsForUser(userId: string) {
    await this.purgeStaleStreams(userId);
    return this.prisma.activeStream.findMany({
      where: { user_id: userId },
      include: {
        profile: { select: { id: true, name: true } },
        device: { select: { id: true, device_name: true, device_uuid: true } },
      },
    });
  }
}
