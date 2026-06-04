import { IsInt, IsString, IsOptional, IsAlpha, IsArray } from 'class-validator';
import { ApiPropertyOptional } from 'node_modules/@nestjs/swagger/dist/decorators/api-property.decorator';

export class SearchLocationDto {
  @ApiPropertyOptional({
    example: 'Senigallia',
    description: 'Search term for location name, supports partial matches',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'Array of location IDs to search for',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  ids?: number[];

  @ApiPropertyOptional({
    example: 'Ancona',
    description: 'Search term for province name, supports partial matches',
  })
  @IsOptional()
  @IsString()
  @IsAlpha()
  province_name?: string;

  @ApiPropertyOptional({
    example: 'Pes',
    description: 'Search term for location name, supports partial matches',
  })
  @IsOptional()
  @IsString()
  @IsAlpha()
  location_like?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Search term for province ID',
  })
  @IsOptional()
  @IsInt()
  province_id?: number;
}
