import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 1 })
  category_id!: number;

  @ApiProperty({ example: 'Introduzione a NestJS' })
  title!: string;

  @ApiProperty({ example: 'introduzione-a-nestjs' })
  slug!: string;

  @ApiPropertyOptional({ example: 'NestJS è un framework backend per Node.js.' })
  content?: string;

  @ApiPropertyOptional({ example: true })
  active?: boolean;
}