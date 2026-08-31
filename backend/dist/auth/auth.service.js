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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, jwtService, usersService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    async register(createUserDto) {
        return this.usersService.createUser(createUserDto);
    }
    async login(loginDto) {
        const { alias, password } = loginDto;
        const user = await this.prisma.user.findFirst({
            where: {
                alias: {
                    equals: alias.trim(),
                    mode: 'insensitive',
                },
            },
            include: {
                subscriptions: {
                    orderBy: { created_at: 'desc' },
                    take: 1,
                    include: { plan: true },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        if (!user.is_active) {
            throw new common_1.UnauthorizedException('La cuenta de usuario se encuentra suspendida o inactiva');
        }
        let isPasswordValid = false;
        try {
            if (user.password_hash && (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$'))) {
                isPasswordValid = await bcrypt.compare(password, user.password_hash);
            }
            else {
                isPasswordValid = password === user.password_hash;
            }
        }
        catch {
            isPasswordValid = password === user.password_hash;
        }
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        let subscriptionInfo = {
            status: 'SIN_SUSCRIPCION',
            days_remaining: 0,
            warning_message: undefined,
        };
        if (user.role === 'CLIENT') {
            const activeSub = user.subscriptions[0];
            if (!activeSub) {
                throw new common_1.UnauthorizedException('El usuario no posee una suscripción activa');
            }
            const now = new Date();
            const endDate = new Date(activeSub.end_date);
            const diffTime = endDate.getTime() - now.getTime();
            const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (now > endDate || activeSub.status === client_1.SubscriptionStatus.VENCIDO || activeSub.status === client_1.SubscriptionStatus.SUSPENDIDO) {
                if (activeSub.status !== client_1.SubscriptionStatus.VENCIDO) {
                    await this.prisma.subscription.update({
                        where: { id: activeSub.id },
                        data: { status: client_1.SubscriptionStatus.VENCIDO },
                    });
                }
                throw new common_1.UnauthorizedException('Tu suscripción está vencida. Renovala para continuar disfrutando del servicio.');
            }
            let currentStatus = activeSub.status;
            let warningMessage = undefined;
            if (daysRemaining <= 3 && daysRemaining >= 0) {
                currentStatus = client_1.SubscriptionStatus.PROXIMO_A_VENCER;
                const formattedDate = endDate.toLocaleDateString('es-AR');
                warningMessage = `⚠️ Tu suscripción vence el ${formattedDate}. Renovala para evitar la interrupción del servicio.`;
                if (activeSub.status !== client_1.SubscriptionStatus.PROXIMO_A_VENCER) {
                    await this.prisma.subscription.update({
                        where: { id: activeSub.id },
                        data: { status: client_1.SubscriptionStatus.PROXIMO_A_VENCER },
                    });
                }
            }
            subscriptionInfo = {
                status: currentStatus,
                days_remaining: daysRemaining,
                warning_message: warningMessage,
            };
        }
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map