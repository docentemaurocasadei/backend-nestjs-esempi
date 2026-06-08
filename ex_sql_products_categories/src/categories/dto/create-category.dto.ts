import { IS_ALPHA, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    name!: string;

    @IsString()
    slug!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
