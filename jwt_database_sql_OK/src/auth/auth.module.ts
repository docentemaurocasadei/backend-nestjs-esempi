import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'database/database.module';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtStrategy } from './jwt-strategy/jwt-strategy';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn:
            (configService.get<string>('JWT_EXPIRES_IN') || '15m') as any,
        },
      }),
      inject: [ConfigService],
    })
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
