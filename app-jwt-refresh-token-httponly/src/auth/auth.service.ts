import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

@Injectable()
export class AuthService {
  private users = [
    {
      id: 1,
      username: 'admin',
      password: '123456',
    },
  ];

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  login(username: string, password: string) {
    const user = this.users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenziali non valide');
    }

    return this.generateTokens(user.id, user.username);
  }

  refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens(payload.sub, payload.username);
    } catch {
      throw new UnauthorizedException('Refresh token non valido');
    }
  }

  private generateTokens(userId: number, username: string) {
    const payload = {
      sub: userId,
      username,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<StringValue>('JWT_SECRET'),
      expiresIn: this.configService.get<StringValue>('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<StringValue>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<StringValue>('JWT_REFRESH_EXPIRES_IN'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}