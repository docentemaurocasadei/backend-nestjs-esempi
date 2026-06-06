import { IsBoolean, IsDecimal, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
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

        @IsDecimal()
        base_price!: number;

        @IsString()
        @IsOptional()
        sku?: string;
        
}
