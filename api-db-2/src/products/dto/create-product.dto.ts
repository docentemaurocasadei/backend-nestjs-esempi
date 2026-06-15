import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {
  @ApiProperty({ example: "Mouse Wireless", description: "Il nome del prodotto" })
  @IsString()
  name!: string;

  @ApiProperty({ example: "Mouse Wireless", description: "La descrizione del prodotto" })
  @IsString()
  description!: string;

  @ApiProperty({ example: 12.99, description: "Il prezzo del prodotto" })
  @IsNumber()
  base_price!: number;

  @IsString()
  slug!: string;
}
