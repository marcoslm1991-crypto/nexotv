import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePlanDto {
  @IsNotEmpty({ message: 'El ID de usuario es obligatorio' })
  @IsString()
  user_id: string;

  @IsNotEmpty({ message: 'El nuevo código de plan es obligatorio' })
  @IsString()
  new_plan_code: string; // INDIVIDUAL, FAMILIAR, FAMILIAR_PLUS
}
