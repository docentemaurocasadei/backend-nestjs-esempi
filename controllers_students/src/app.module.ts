import { Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { SendEmailModule } from './send-email/send-email.module';
import { ApiMiddleware } from './middleware/api.middleware';
import { ConfigModule } from '@nestjs/config';
import { CheckTimerMiddleware } from './check-timer/check-timer.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StudentsModule,
    SendEmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: any) {
    consumer.apply(ApiMiddleware).forRoutes(
      { path: 'students', method: RequestMethod.POST },
      { path: 'students/:id', method: RequestMethod.PUT },
      { path: 'students/:id', method: RequestMethod.DELETE }
    );
    consumer.apply(CheckTimerMiddleware).forRoutes('*');  
  }
}
