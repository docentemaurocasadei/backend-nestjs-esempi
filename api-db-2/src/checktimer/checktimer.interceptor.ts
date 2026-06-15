import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
@Injectable()
export class ChecktimerInterceptor implements NestInterceptor {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger(ChecktimerInterceptor.name);
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const deltaTime = endTime - startTime;

        const className = context.getClass().name;
        const handlerName = context.getHandler().name;
        this.logger.log(`Request ${className} ${handlerName} took ${deltaTime}ms`);
      })
    );
  }
}
