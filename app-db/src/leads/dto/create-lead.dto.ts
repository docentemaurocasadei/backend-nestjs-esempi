import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
    @IsString()
    @ApiProperty()
    name!: string;

    @IsString()
    @ApiProperty()
    surname!: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    gender?: string;
}
