import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CheckTokenMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const token = req.headers['authorization'];
    console.log(`Received token: ${token}`);
    if (!token || token !== 'mysecrettoken') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }
}
