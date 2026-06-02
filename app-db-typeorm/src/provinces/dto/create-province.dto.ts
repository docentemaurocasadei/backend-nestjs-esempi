import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { OneToMany } from 'typeorm';

export class CreateProvinceDto {
  @ApiProperty({ description: 'The name of the province' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ description: 'The code of the province' })
  @IsNotEmpty()
  @IsString()
  code!: string;

}
