import { Injectable, NestMiddleware } from '@nestjs/common';
import { join } from 'path/posix';
import * as winston from 'winston';

@Injectable()
export class MyloggerMiddleware implements NestMiddleware {
  private logger: winston.Logger;
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: 'user-service' },
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      );
    }
  }
  use(req: any, res: any, next: () => void) {
    // console.log(__dirname)
    this.logger.info('Request: ' + JSON.stringify(req.body));
    const publicPath = join(__dirname, '..', 'public');
    this.logger.info('publicPath: ' + publicPath)
    res.on('finish', () => {
      this.logger.info('Response: ' + JSON.stringify(res.body));
    });
    next();
  }
}
