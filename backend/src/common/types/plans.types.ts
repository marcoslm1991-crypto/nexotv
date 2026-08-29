export interface PlanDto {
  id: string;
  name: string;
  code: string; // INDIVIDUAL, FAMILIAR, FAMILIAR_PLUS
  max_screens: number;
  max_profiles: number;
  description?: string;
  is_active: boolean;
}
