import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CheckTimerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const startTime = Date.now();
    res.on('finish', () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`Request to ${req.originalUrl} took ${duration}ms`);
    });
    next();
  }
}
