import { Controller, Post, Body} from '@nestjs/common';
import { CredentialsDto } from './credentials/credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() credentials: CredentialsDto): Promise<{ access_token: string; refresh_token: string }> {
        return this.authService.login(credentials);
    }
    @Post('refresh')
    refreshToken(@Body('token') token: string): Promise<{ access_token: string }> {
        return this.authService.refreshToken(token);
    }
}
