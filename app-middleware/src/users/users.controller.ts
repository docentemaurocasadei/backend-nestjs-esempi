import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get()
    async findAll() {
        return 'arrivato al controller';
    }
}
