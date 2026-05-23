import { Controller, Get } from '@nestjs/common';

@Controller('posts')
export class PostsController {
    @Get()
    getPosts() {
        return 'Lista post';
    }
}
