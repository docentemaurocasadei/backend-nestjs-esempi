import {
  Body, Controller, Post, Req, Res,
  UnauthorizedException, HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/dto.auth';
import type { Request, Response } from 'express';

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = this.authService.login(body.username, body.password);
    this.setAccessTokenCookie(res, tokens.access_token); // ← aggiunto

    this.setRefreshTokenCookie(res, tokens.refresh_token);
    return { message: 'Login effettuato' }; // ← niente access_token nel body

  }

  @Post('refresh')
  @HttpCode(200)
  refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token mancante');
    }
    const tokens = this.authService.refresh(refreshToken);
    this.setAccessTokenCookie(res, tokens.access_token); // ← aggiunto

    this.setRefreshTokenCookie(res, tokens.refresh_token);
    return { message: 'Token rinnovato' }; // ← niente access_token nel body

  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ACCESS_COOKIE, { path: '/' }); // ← aggiunto

    res.clearCookie(REFRESH_COOKIE, { path: '/auth/refresh' });
    return { message: 'Logout effettuato' };
  }

  private setAccessTokenCookie(res: Response, token: string) {
    res.cookie(ACCESS_COOKIE, token, { // ← nuovo metodo

      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie(REFRESH_COOKIE, token, {
      httpOnly: true,
      sameSite: 'strict', // ← era 'lax'

      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh', // ← scope ristretto

    });
  }
}