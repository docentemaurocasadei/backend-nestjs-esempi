import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto/credentials.dto';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}
    @Post('login')
    login(@Body() credentials: CredentialsDto) {
        return this.authService.login(credentials);    
    }

    @Post('refresh')
    refreshToken(@Body('refresh_token') token: string) {
        return this.authService.refreshToken(token);
    }
}
