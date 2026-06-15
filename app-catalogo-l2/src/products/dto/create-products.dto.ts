import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
  @ApiProperty({ description: "The name of the product", example: 'Wireless Mouse' })
  name!: string;
  @ApiProperty({ description: "The price of the product", example: 19.99 })
  price!: number;
}