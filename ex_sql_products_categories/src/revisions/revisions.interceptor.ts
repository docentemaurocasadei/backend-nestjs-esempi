import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import fs from 'fs';
import os from 'os';

@Injectable()
export class RevisionsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.originalUrl;
    const row = {
      method: method,
      url: url,
      timestamp: new Date(),
      body: request.body,
    }
    const filePath = 'revisions.log';
    fs.appendFileSync(
          filePath,
          JSON.stringify(row) + '\n',
        );
    return next.handle();
  }
}
