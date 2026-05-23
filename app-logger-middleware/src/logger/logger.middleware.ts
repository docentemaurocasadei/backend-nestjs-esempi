import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}] ${message}`;
      }),
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs/requests.log' }),
      new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }),
    ],
  });

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;

      const message = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;

      if (res.statusCode >= 400) {
        this.logger.error(message);
      } else {
        this.logger.info(message);
      }
    });

    next();
  }
}
