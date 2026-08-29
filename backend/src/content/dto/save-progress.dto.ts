import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class SaveProgressDto {
  @IsNotEmpty()
  @IsString()
  profile_id: string;

  @IsNotEmpty()
  @IsString()
  content_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  progress_seconds: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  duration_seconds: number;
}
