import { Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { CheckTokenMiddleware } from './middleware/check-token/check-token.middleware';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core/constants';

@Module({
  imports: [PostsModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),

  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {
  configure(consumer: any) {
    consumer
      .apply(CheckTokenMiddleware)
      .forRoutes(
        {path: 'posts', method: RequestMethod.POST},
        {path: 'posts/:id', method: RequestMethod.PATCH},
        {path: 'posts/:id', method: RequestMethod.DELETE}
      );
  }
}
