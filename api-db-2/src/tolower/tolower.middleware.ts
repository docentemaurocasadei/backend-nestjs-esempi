import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TolowerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const body = req.body;
    for (const key in body) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        const value = body[key];
        if (typeof value === 'string') {
          body[key] = value.toLowerCase();
        }
      }
    }
    req.body = body;
    next();
  }
}
