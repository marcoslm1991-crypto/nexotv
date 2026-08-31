import { SubscriptionsService } from './subscriptions.service';
import { RenewSubscriptionDto } from './dto/renew-subscription.dto';
import { ChangePlanDto } from './dto/change-plan.dto';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    renewSubscription(dto: RenewSubscriptionDto): Promise<{
        message: string;
        subscription_id: string;
        user_id: string;
        plan: string;
        new_end_date: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
    }>;
    changePlan(dto: ChangePlanDto): Promise<{
        message: string;
        plan_code: string;
        max_screens: number;
        max_profiles: number;
    }>;
    getHistory(userId: string): Promise<{
        id: string;
        created_at: Date;
        user_id: string;
        plan_id: string;
        start_date: Date;
        end_date: Date;
        subscription_id: string;
        action: string;
        notes: string | null;
    }[]>;
}
