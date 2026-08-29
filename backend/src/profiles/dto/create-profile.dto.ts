import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty({ message: 'El nombre del perfil es requerido' })
  @IsString()
  @MaxLength(30, { message: 'El nombre del perfil no puede exceder 30 caracteres' })
  name: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;
}
