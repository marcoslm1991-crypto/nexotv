import { PlansService } from './plans.service';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    getPlans(): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        code: string;
        max_screens: number;
        max_profiles: number;
        description: string | null;
    }[]>;
    getPlanByCode(code: string): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        code: string;
        max_screens: number;
        max_profiles: number;
        description: string | null;
    } | null>;
}
