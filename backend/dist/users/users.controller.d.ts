import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SubscriptionStatus } from '@prisma/client';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(createUserDto: CreateUserDto): Promise<{
        id: string;
        alias: string;
        name: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        plan: string;
        subscription_end: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
    }>;
    findAll(search?: string, status?: SubscriptionStatus, plan_code?: string): Promise<{
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
    getMyProfile(req: any): Promise<{
        subscriptions: ({
            plan: {
                id: string;
                is_active: boolean;
                created_at: Date;
                updated_at: Date;
                name: string;
                description: string | null;
                code: string;
                max_screens: number;
                max_profiles: number;
            };
            history: {
                id: string;
                created_at: Date;
                user_id: string;
                plan_id: string;
                start_date: Date;
                end_date: Date;
                subscription_id: string;
                action: string;
                notes: string | null;
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
            created_at: Date;
            updated_at: Date;
            name: string;
            user_id: string;
            avatar_url: string | null;
        }[];
        devices: {
            id: string;
            created_at: Date;
            user_id: string;
            device_name: string;
            device_uuid: string;
            last_active: Date;
        }[];
    } & {
        id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        name: string | null;
        alias: string;
        password_hash: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    findOne(id: string): Promise<{
        subscriptions: ({
            plan: {
                id: string;
                is_active: boolean;
                created_at: Date;
                updated_at: Date;
                name: string;
                description: string | null;
                code: string;
                max_screens: number;
                max_profiles: number;
            };
            history: {
                id: string;
                created_at: Date;
                user_id: string;
                plan_id: string;
                start_date: Date;
                end_date: Date;
                subscription_id: string;
                action: string;
                notes: string | null;
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
            created_at: Date;
            updated_at: Date;
            name: string;
            user_id: string;
            avatar_url: string | null;
        }[];
        devices: {
            id: string;
            created_at: Date;
            user_id: string;
            device_name: string;
            device_uuid: string;
            last_active: Date;
        }[];
    } & {
        id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        name: string | null;
        alias: string;
        password_hash: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
}
