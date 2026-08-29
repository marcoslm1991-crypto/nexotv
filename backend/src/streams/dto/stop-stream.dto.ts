import { IsNotEmpty, IsString } from 'class-validator';

export class StopStreamDto {
  @IsNotEmpty({ message: 'El ID de reproducción activa es obligatorio' })
  @IsString()
  active_stream_id: string;
}
