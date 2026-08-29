import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AuthorizeStreamDto {
  @IsNotEmpty({ message: 'El ID del perfil es requerido' })
  @IsString()
  profile_id: string;

  @IsNotEmpty({ message: 'El nombre del dispositivo es requerido' })
  @IsString()
  device_name: string;

  @IsNotEmpty({ message: 'El identificador único (UUID) del dispositivo es requerido' })
  @IsString()
  device_uuid: string;

  @IsOptional()
  @IsString()
  content_id?: string;
}
