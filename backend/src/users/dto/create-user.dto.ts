import { IsNotEmpty, IsString, MinLength, IsOptional, IsInt, Min } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El alias/usuario es obligatorio' })
  @IsString()
  alias: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty({ message: 'La contraseña inicial es obligatoria' })
  @IsString()
  @MinLength(4, { message: 'La contraseña debe tener mínimo 4 caracteres o dígitos' })
  password: string;

  @IsNotEmpty({ message: 'El código de plan es obligatorio' })
  @IsString()
  plan_code: string; // INDIVIDUAL, FAMILIAR, FAMILIAR_PLUS

  @IsOptional()
  @IsInt()
  @Min(1)
  duration_months?: number = 1;
}
