"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProfilesService = class ProfilesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProfile(userId, dto) {
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
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const activeSub = user.subscriptions[0];
        const maxProfiles = activeSub?.plan?.max_profiles || 1;
        if (user.profiles.length >= maxProfiles) {
            throw new common_1.BadRequestException(`Has alcanzado el límite máximo de ${maxProfiles} perfil(es) permitidos por tu ${activeSub?.plan?.name || 'Plan'}.`);
        }
        return this.prisma.profile.create({
            data: {
                user_id: userId,
                name: dto.name,
                avatar_url: dto.avatar_url,
            },
        });
    }
    async findMyProfiles(userId) {
        return this.prisma.profile.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'asc' },
        });
    }
    async updateProfile(userId, profileId, dto) {
        const profile = await this.prisma.profile.findUnique({
            where: { id: profileId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Perfil no encontrado');
        }
        if (profile.user_id !== userId) {
            throw new common_1.ForbiddenException('No tienes permiso para modificar este perfil');
        }
        return this.prisma.profile.update({
            where: { id: profileId },
            data: {
                ...(dto.name && { name: dto.name }),
                ...(dto.avatar_url !== undefined && { avatar_url: dto.avatar_url }),
            },
        });
    }
    async removeProfile(userId, profileId) {
        const profiles = await this.prisma.profile.findMany({
            where: { user_id: userId },
        });
        if (profiles.length <= 1) {
            throw new common_1.BadRequestException('Debe haber al menos 1 perfil activo en la cuenta.');
        }
        const profileToDelete = profiles.find((p) => p.id === profileId);
        if (!profileToDelete) {
            throw new common_1.NotFoundException('Perfil no encontrado');
        }
        return this.prisma.profile.delete({
            where: { id: profileId },
        });
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map