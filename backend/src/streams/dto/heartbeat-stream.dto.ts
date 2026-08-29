import { IsNotEmpty, IsString } from 'class-validator';

export class HeartbeatStreamDto {
  @IsNotEmpty({ message: 'El ID de reproducción activa es obligatorio' })
  @IsString()
  active_stream_id: string;
}
