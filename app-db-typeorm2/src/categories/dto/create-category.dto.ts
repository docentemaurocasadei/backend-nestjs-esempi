import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @ApiProperty({ example: 'Electronics' })
    name!: string

    @IsString()
    @ApiProperty({ example: 'Electronic products', required: false })
    description: string | null

    @IsString()
    @ApiProperty({ example: 'electronics', required: false })
    slug: string | null


}
