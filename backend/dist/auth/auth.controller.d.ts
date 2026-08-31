import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    register(createUserDto: CreateUserDto): Promise<{
        id: string;
        alias: string;
        name: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        plan: string;
        subscription_end: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
    }>;
}
