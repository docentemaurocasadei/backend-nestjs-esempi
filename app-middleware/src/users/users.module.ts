import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
    controllers: [UsersController]
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
         consumer.apply(AuthMiddleware).forRoutes(UsersController);
    }
}
