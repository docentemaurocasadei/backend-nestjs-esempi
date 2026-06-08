import { IsInt, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name!: string;

  @IsInt()
  province_id!: number;
}
