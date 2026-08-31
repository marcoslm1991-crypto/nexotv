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
exports.StreamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let StreamsService = class StreamsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.HEARTBEAT_TIMEOUT_SECONDS = parseInt(process.env.STREAM_HEARTBEAT_TIMEOUT_SECONDS || '60', 10);
    }
    async purgeStaleStreams(userId) {
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
    async authorizeStream(userId, dto) {
        await this.purgeStaleStreams(userId);
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
            throw new common_1.ForbiddenException('Usuario no autorizado o inactivo.');
        }
        const activeSub = user.subscriptions[0];
        if (!activeSub || activeSub.status === client_1.SubscriptionStatus.VENCIDO || activeSub.status === client_1.SubscriptionStatus.SUSPENDIDO) {
            throw new common_1.ForbiddenException('Tu suscripción está vencida o inactiva. Renovala para acceder al contenido.');
        }
        const plan = activeSub.plan;
        const maxScreens = plan.max_screens;
        const profile = user.profiles.find((p) => p.id === dto.profile_id);
        if (!profile) {
            throw new common_1.BadRequestException('El perfil seleccionado no pertenece a tu cuenta.');
        }
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
        const existingDeviceStream = await this.prisma.activeStream.findFirst({
            where: {
                user_id: userId,
                device_id: device.id,
            },
        });
        if (existingDeviceStream) {
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
        const currentActiveCount = await this.prisma.activeStream.count({
            where: { user_id: userId },
        });
        if (currentActiveCount >= maxScreens) {
            let customErrorMessage = `Ya alcanzaste el límite de ${maxScreens} pantalla(s) simultánea(s) de tu ${plan.name}. Para continuar, cerrá la reproducción en uno de tus dispositivos.`;
            if (plan.code === 'FAMILIAR') {
                customErrorMessage = `Ya alcanzaste el límite de 3 pantallas simultáneas de tu Plan Familiar. Para continuar, cerrá la reproducción en uno de tus dispositivos o contratá el Plan Familiar Plus de hasta 5 pantallas.`;
            }
            else if (plan.code === 'INDIVIDUAL') {
                customErrorMessage = `Ya alcanzaste el límite de 1 pantalla simultánea de tu Plan Individual. Para continuar, cerrá la reproducción en tu otro dispositivo o contratá el Plan Familiar de hasta 3 pantallas.`;
            }
            throw new common_1.ForbiddenException({
                statusCode: 403,
                error: 'Forbidden',
                message: customErrorMessage,
                max_screens: maxScreens,
                current_active_screens: currentActiveCount,
            });
        }
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
    async heartbeat(userId, dto) {
        const stream = await this.prisma.activeStream.findUnique({
            where: { id: dto.active_stream_id },
        });
        if (!stream || stream.user_id !== userId) {
            throw new common_1.NotFoundException('Sesión de reproducción no encontrada o expirada.');
        }
        await this.prisma.activeStream.update({
            where: { id: dto.active_stream_id },
            data: { last_heartbeat: new Date() },
        });
        return { success: true, timestamp: new Date() };
    }
    async stopStream(userId, dto) {
        const stream = await this.prisma.activeStream.findUnique({
            where: { id: dto.active_stream_id },
        });
        if (!stream) {
            return { success: true, message: 'La sesión ya se encontraba liberada.' };
        }
        if (stream.user_id !== userId) {
            throw new common_1.ForbiddenException('No tienes permiso para detener esta sesión.');
        }
        await this.prisma.activeStream.delete({
            where: { id: dto.active_stream_id },
        });
        return { success: true, message: 'Pantalla liberada correctamente.' };
    }
    async getActiveStreamsForUser(userId) {
        await this.purgeStaleStreams(userId);
        return this.prisma.activeStream.findMany({
            where: { user_id: userId },
            include: {
                profile: { select: { id: true, name: true } },
                device: { select: { id: true, device_name: true, device_uuid: true } },
            },
        });
    }
};
exports.StreamsService = StreamsService;
exports.StreamsService = StreamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StreamsService);
//# sourceMappingURL=streams.service.js.map