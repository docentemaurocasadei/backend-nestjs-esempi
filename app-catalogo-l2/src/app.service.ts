import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService
  ) {
    
  }
  getHello(): string {
    const appName = this.configService.get<string>('APP_NAME');
    return `Ciao ${appName}! Benvenuto nella tua applicazione NestJS!`;
  }
}
