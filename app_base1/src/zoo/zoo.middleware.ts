import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ZooMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const key = req.headers['x-api-key'];
    if (key !== 'zoo-key') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  }
}
