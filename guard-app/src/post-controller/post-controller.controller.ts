import { Controller, Get, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard, seconds } from '@nestjs/throttler';
import { ApiKeyGuard } from 'src/auth/api-key/api-key.guard';

@Controller('posts')
export class PostControllerController {
    @Get()
    getHello(): string {
        return 'Hello World Post!';
    }

    @UseGuards(ApiKeyGuard,ThrottlerGuard)
    @Throttle({ default: { ttl: 60000, limit: 5 } })
    @Get('protected')
    getProtected(): string {
        return 'This is a protected route!';
    }
}
