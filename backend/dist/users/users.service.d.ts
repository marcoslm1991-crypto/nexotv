import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SubscriptionStatus } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(dto: CreateUserDto): Promise<{
        id: string;
        alias: string;
        name: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        plan: string;
        subscription_end: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
    }>;
    findAll(query?: {
        search?: string;
        status?: SubscriptionStatus;
        plan_code?: string;
    }): Promise<{
        id: string;
        alias: string;
        name: string | null;
        is_active: boolean;
        created_at: Date;
        plan_name: string;
        plan_code: string;
        max_screens: number;
        subscription_status: import(".prisma/client").$Enums.SubscriptionStatus;
        end_date: Date;
        profile_count: number;
    }[]>;
    findOne(id: string): Promise<{
        subscriptions: ({
            plan: {
                id: string;
                name: string;
                is_active: boolean;
                created_at: Date;
                updated_at: Date;
                code: string;
                max_screens: number;
                max_profiles: number;
                description: string | null;
            };
            history: {
                id: string;
                created_at: Date;
                user_id: string;
                plan_id: string;
                start_date: Date;
                end_date: Date;
                action: string;
                notes: string | null;
                subscription_id: string;
            }[];
        } & {
            id: string;
            created_at: Date;
            updated_at: Date;
            user_id: string;
            plan_id: string;
            start_date: Date;
            end_date: Date;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
        })[];
        profiles: {
            id: string;
            name: string;
            created_at: Date;
            updated_at: Date;
            user_id: string;
            avatar_url: string | null;
        }[];
        devices: {
            id: string;
            created_at: Date;
            user_id: string;
            device_uuid: string;
            device_name: string;
            last_active: Date;
        }[];
    } & {
        alias: string;
        id: string;
        name: string | null;
        password_hash: string;
        role: import(".prisma/client").$Enums.UserRole;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
}
