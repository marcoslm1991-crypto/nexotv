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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SubscriptionsService = class SubscriptionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async renewSubscription(dto) {
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
            throw new common_1.NotFoundException(`Usuario no encontrado`);
        }
        const currentSub = user.subscriptions[0];
        if (!currentSub) {
            throw new common_1.BadRequestException(`El usuario no cuenta con un registro de suscripción`);
        }
        const now = new Date();
        let newStartDate = new Date(currentSub.start_date);
        let baseEndDate = new Date(currentSub.end_date);
        if (baseEndDate < now) {
            newStartDate = now;
            baseEndDate = now;
        }
        const newEndDate = new Date(baseEndDate);
        newEndDate.setMonth(newEndDate.getMonth() + dto.months);
        const actionName = dto.months === 1 ? 'RENEWAL_1_MONTH' : 'RENEWAL_MULTI';
        const result = await this.prisma.$transaction(async (tx) => {
            const updatedSub = await tx.subscription.update({
                where: { id: currentSub.id },
                data: {
                    start_date: newStartDate,
                    end_date: newEndDate,
                    status: client_1.SubscriptionStatus.VIGENTE,
                },
                include: { plan: true },
            });
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
    async changePlan(dto) {
        const newPlan = await this.prisma.plan.findUnique({
            where: { code: dto.new_plan_code.toUpperCase() },
        });
        if (!newPlan || !newPlan.is_active) {
            throw new common_1.BadRequestException(`El plan '${dto.new_plan_code}' no es válido o está inactivo`);
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
            throw new common_1.NotFoundException(`Suscripción de usuario no encontrada`);
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
    async getHistory(userId) {
        return this.prisma.subscriptionHistory.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
        });
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map