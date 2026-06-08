import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
console.log('AuthMiddleware: Checking authentication...');
console.log('Request Headers:', req.headers);
console.log('Request Method:', req.method);
    if (req.headers['email'] !== 'admin@email.it' 
      || req.headers['password'] !== 'admin'
    ) {
      console.log('AuthMiddleware: Unauthorized access attempt');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }
}
