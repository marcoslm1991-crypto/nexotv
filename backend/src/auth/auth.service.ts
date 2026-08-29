import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { alias, password } = loginDto;

    // 1. Buscar usuario por alias
    const user = await this.prisma.user.findUnique({
      where: { alias },
      include: {
        subscriptions: {
          orderBy: { created_at: 'desc' },
          take: 1,
          include: { plan: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('La cuenta de usuario se encuentra suspendida o inactiva');
    }

    // 2. Verificar contraseña hasheada (OWASP)
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Verificar estado de suscripción para usuarios CLIENT
    let subscriptionInfo = {
      status: 'SIN_SUSCRIPCION',
      days_remaining: 0,
      warning_message: undefined as string | undefined,
    };

    if (user.role === 'CLIENT') {
      const activeSub = user.subscriptions[0];

      if (!activeSub) {
        throw new UnauthorizedException('El usuario no posee una suscripción activa');
      }

      const now = new Date();
      const endDate = new Date(activeSub.end_date);
      const diffTime = endDate.getTime() - now.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (now > endDate || activeSub.status === SubscriptionStatus.VENCIDO || activeSub.status === SubscriptionStatus.SUSPENDIDO) {
        // Actualizar estado en DB si no estaba marcado como VENCIDO
        if (activeSub.status !== SubscriptionStatus.VENCIDO) {
          await this.prisma.subscription.update({
            where: { id: activeSub.id },
            data: { status: SubscriptionStatus.VENCIDO },
          });
        }
        throw new UnauthorizedException('Tu suscripción está vencida. Renovala para continuar disfrutando del servicio.');
      }

      // Aviso de 3 días o menos
      let currentStatus: SubscriptionStatus = activeSub.status;
      let warningMessage: string | undefined = undefined;

      if (daysRemaining <= 3 && daysRemaining >= 0) {
        currentStatus = SubscriptionStatus.PROXIMO_A_VENCER;
        const formattedDate = endDate.toLocaleDateString('es-AR');
        warningMessage = `⚠️ Tu suscripción vence el ${formattedDate}. Renovala para evitar la interrupción del servicio.`;

        if (activeSub.status !== SubscriptionStatus.PROXIMO_A_VENCER) {
          await this.prisma.subscription.update({
            where: { id: activeSub.id },
            data: { status: SubscriptionStatus.PROXIMO_A_VENCER },
          });
        }
      }

      subscriptionInfo = {
        status: currentStatus,
        days_remaining: daysRemaining,
        warning_message: warningMessage,
      };
    }

    // 4. Generar Token JWT
    const payload = { sub: user.id, alias: user.alias, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        alias: user.alias,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
      },
      subscription: subscriptionInfo,
    };
  }
}
