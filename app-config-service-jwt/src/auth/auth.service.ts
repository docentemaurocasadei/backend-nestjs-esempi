import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class AuthService {
    private readonly users = [
        { id: 1, username: 'admin', password: 'admin' },
        { id: 2, username: 'user', password: 'user' },
    ];

    constructor(
        private readonly jwtService: JwtService
    ) {}
    async validateUser(username: string, password: string): Promise<any> {
        const user = this.users.find(user => user.username === username && user.password === password);
        if (user) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
