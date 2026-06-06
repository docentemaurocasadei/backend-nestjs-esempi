import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class CheckTimerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    return next.handle().pipe(
      map((data) => {
        const duration = Date.now() - startTime;
        const request = context.switchToHttp().getRequest();

        console.log(`Request to ${request.originalUrl} took ${duration}ms`);

        return {
          data,
          meta: {
            responseTime: `${duration}ms`,
          },
        };
      }),
    );
  }
}
