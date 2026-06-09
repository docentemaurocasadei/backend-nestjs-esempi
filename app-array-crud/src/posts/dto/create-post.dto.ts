import { ApiAcceptedResponse, ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePostDto {
    @ApiProperty({ description: 'The title of the post', example: 'My First Post' })
    @IsString()
    title!: string;
    
    @ApiProperty({ description: 'The content of the post', example: 'This is the content of my first post.' })
    @IsString()
    content!: string;
}
