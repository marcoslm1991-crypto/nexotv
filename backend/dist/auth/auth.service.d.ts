import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private usersService;
    constructor(prisma: PrismaService, jwtService: JwtService, usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<{
        id: string;
        alias: string;
        name: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        plan: string;
        subscription_end: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            alias: string;
            name: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            is_active: true;
        };
        subscription: {
            status: string;
            days_remaining: number;
            warning_message: string | undefined;
        };
    }>;
}
