import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CredentialsDto } from './credentials/credentials.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}
    async login(credentials: CredentialsDto): Promise<{ access_token: string; refresh_token: string }> {
        // Here you would typically validate the credentials against a database or other data source
        if (credentials.username === 'admin' && credentials.password === 'password') {
            const tokens = await this.generateTokens(1, credentials.username);
            return tokens;
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
    async generateTokens(userId: number, username: string): Promise<{ access_token: string; refresh_token: string }> {
        const payload = { username, sub: userId };
        const expireIn:any = this.configService.getOrThrow<string>('JWT_EXPIRES_IN');
        const refreshExpireIn:any = this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN');
        const access_token = this.jwtService.sign(payload, { expiresIn: expireIn });
        const refresh_token = this.jwtService.sign(payload, { expiresIn: refreshExpireIn });
        return { access_token, refresh_token };
    }
    async refreshToken(token: string): Promise<{ access_token: string }> {
  try {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });

    const access_token = this.jwtService.sign(
      { username: payload.username, sub: payload.sub },
      {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_EXPIRES_IN') as any,
      },
    );

    return { access_token };
  } catch {
    throw new UnauthorizedException('Invalid refresh token');
  }
}
}
