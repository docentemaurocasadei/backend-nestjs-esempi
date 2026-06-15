import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsBoolean } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        description: "Name of the product",
        example: "Laptop"
    })
    @IsString()
    name: string
    @ApiProperty({
        description: "Description of the product",
        example: "This is a good laptop"
    })
    @IsString()
    description: string
    @ApiProperty({
        description: "Slug of the product",
        example: "laptop"
    })
    @IsString()
    slug: string
    @ApiProperty({
        description: "Base price of the product",
        example: 1000
    })
    @IsNumber()
    base_price: number
    @ApiProperty({
        description: "SKU of the product",
        example: "123456789"
    })
    @IsString()
    sku: string
    @ApiProperty({
        description: "Image of the product",
        example: "https://example.com/image.jpg"
    })
    @IsBoolean()
    is_active: boolean
}
