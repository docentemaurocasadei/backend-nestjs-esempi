import { IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    name!: string;
    @IsString()
    description!: string;
    @IsString()
    base_price!: number;
}
