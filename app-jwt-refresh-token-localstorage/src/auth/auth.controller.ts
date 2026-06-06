import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginDto, RefreshTokenDto } from './dto/dto.auth';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.username, body.password);
  }

  @Post('refresh')
  refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refresh_token);
  }
}