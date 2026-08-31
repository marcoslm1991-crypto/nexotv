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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { alias: dto.alias },
        });
        if (existingUser) {
            throw new common_1.BadRequestException(`El usuario/alias '${dto.alias}' ya se encuentra registrado`);
        }
        const plan = await this.prisma.plan.findUnique({
            where: { code: dto.plan_code.toUpperCase() },
        });
        if (!plan || !plan.is_active) {
            throw new common_1.BadRequestException(`El plan '${dto.plan_code}' no existe o no está activo`);
        }
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(dto.password, salt);
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + (dto.duration_months || 1));
        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    alias: dto.alias,
                    name: dto.name || dto.alias,
                    password_hash,
                    role: client_1.UserRole.CLIENT,
                    is_active: true,
                },
            });
            const subscription = await tx.subscription.create({
                data: {
                    user_id: user.id,
                    plan_id: plan.id,
                    start_date: startDate,
                    end_date: endDate,
                    status: client_1.SubscriptionStatus.VIGENTE,
                },
            });
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
            await tx.profile.create({
                data: {
                    user_id: user.id,
                    name: 'Perfil 1',
                },
            });
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
    async findAll(query) {
        const whereClause = {
            role: client_1.UserRole.CLIENT,
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Usuario con ID '${id}' no encontrado`);
        }
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map