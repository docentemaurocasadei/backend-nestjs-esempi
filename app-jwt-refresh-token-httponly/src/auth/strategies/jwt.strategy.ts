import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
// ExtractJwt non serve più
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {         // ← era fromAuthHeaderAsBearerToken()

        return req?.cookies?.['access_token'] ?? null;

      },

      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true, // ← serve per leggere req.cookies

    });
  }

  validate(req: Request, payload: { sub: number; username: string }) {
    if (!payload) throw new UnauthorizedException();
    return { userId: payload.sub, username: payload.username };
  }
}