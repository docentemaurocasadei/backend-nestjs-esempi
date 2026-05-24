import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Tecnologia' })
  name!: string;

  @ApiPropertyOptional({ example: 'Articoli su sviluppo software e tecnologia' })
  description?: string;

  @ApiPropertyOptional({ example: true })
  active?: boolean;
}