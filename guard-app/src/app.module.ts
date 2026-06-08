import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostControllerController } from './post-controller/post-controller.controller';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core/constants';

@Module({
  imports: [
    ThrottlerModule.forRoot(
      {
        throttlers: [{
          ttl: 60000,
          limit: 10,
        }],
      }
    ),
  ],
  controllers: [AppController, PostControllerController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
