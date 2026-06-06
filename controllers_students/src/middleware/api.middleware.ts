import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ApiMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const api = req.headers['x-api-key'];
    console.log(`'API Middleware executed' ${api}`);
    if (api !== process.env.API_KEY) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }
}
