import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async createProfile(userId: string, dto: CreateProfileDto) {
    // 1. Obtener suscripción y plan activo del usuario
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

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const activeSub = user.subscriptions[0];
    const maxProfiles = activeSub?.plan?.max_profiles || 1;

    if (user.profiles.length >= maxProfiles) {
      throw new BadRequestException(
        `Has alcanzado el límite máximo de ${maxProfiles} perfil(es) permitidos por tu ${activeSub?.plan?.name || 'Plan'}.`
      );
    }

    return this.prisma.profile.create({
      data: {
        user_id: userId,
        name: dto.name,
        avatar_url: dto.avatar_url,
      },
    });
  }

  async findMyProfiles(userId: string) {
    return this.prisma.profile.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'asc' },
    });
  }

  async updateProfile(userId: string, profileId: string, dto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    if (profile.user_id !== userId) {
      throw new ForbiddenException('No tienes permiso para modificar este perfil');
    }

    return this.prisma.profile.update({
      where: { id: profileId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.avatar_url !== undefined && { avatar_url: dto.avatar_url }),
      },
    });
  }

  async removeProfile(userId: string, profileId: string) {
    const profiles = await this.prisma.profile.findMany({
      where: { user_id: userId },
    });

    if (profiles.length <= 1) {
      throw new BadRequestException('Debe haber al menos 1 perfil activo en la cuenta.');
    }

    const profileToDelete = profiles.find((p) => p.id === profileId);
    if (!profileToDelete) {
      throw new NotFoundException('Perfil no encontrado');
    }

    return this.prisma.profile.delete({
      where: { id: profileId },
    });
  }
}
