import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Province } from 'src/provinces/entities/province.entity';
import { ManyToOne, OneToMany } from 'typeorm';

export class CreateLocationDto {
    @ApiProperty({ description: 'The name of the location' })
    @IsNotEmpty()
    @IsString()
    name!: string;

    @ApiProperty({ description: 'The province of the location' })
    @IsNotEmpty()
    province_id!: number;
}
