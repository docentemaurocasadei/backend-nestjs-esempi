import { IsOptional, IsString, MinLength } from "class-validator";

export class CreatePostDto {
    @IsString()
    @MinLength(10)
    title!: string;
    @IsString()
    description!: string;
    @IsString()
    @IsOptional()
    author!: string;
}
