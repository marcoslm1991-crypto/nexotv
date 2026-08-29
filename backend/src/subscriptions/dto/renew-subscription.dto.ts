import { IsNotEmpty, IsString, IsInt, Min, IsOptional } from 'class-validator';

export class RenewSubscriptionDto {
  @IsNotEmpty({ message: 'El ID de usuario es obligatorio' })
  @IsString()
  user_id: string;

  @IsNotEmpty({ message: 'La cantidad de meses a agregar es obligatoria' })
  @IsInt()
  @Min(1, { message: 'Se debe renovar como mínimo 1 mes' })
  months: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
