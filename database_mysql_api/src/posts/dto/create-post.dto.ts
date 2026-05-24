import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  slug!: string;

  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsBoolean()
  active?: boolean = true;

  @IsNotEmpty()
  @IsInt()
  category_id!: number;
}
