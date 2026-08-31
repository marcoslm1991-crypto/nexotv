export declare enum SubscriptionStatus {
    VIGENTE = "VIGENTE",
    PROXIMO_A_VENCER = "PROXIMO_A_VENCER",
    VENCIDO = "VENCIDO",
    SUSPENDIDO = "SUSPENDIDO"
}
export interface SubscriptionDto {
    id: string;
    user_id: string;
    plan_id: string;
    start_date: string;
    end_date: string;
    status: SubscriptionStatus;
    days_remaining: number;
    plan?: {
        name: string;
        code: string;
        max_screens: number;
        max_profiles: number;
    };
}
//# sourceMappingURL=subscriptions.types.d.ts.map