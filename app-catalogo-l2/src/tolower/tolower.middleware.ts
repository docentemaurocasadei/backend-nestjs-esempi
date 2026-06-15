import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TolowerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].toLowerCase();
      }    
    }
    next();
  }
}
