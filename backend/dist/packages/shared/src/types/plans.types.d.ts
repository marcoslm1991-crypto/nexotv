export interface PlanDto {
    id: string;
    name: string;
    code: string;
    max_screens: number;
    max_profiles: number;
    description?: string;
    is_active: boolean;
}
