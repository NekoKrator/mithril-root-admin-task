import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register') // http://localhost:3000/auth/register
    async register(
        @Body('email') email: string,
        @Body('password') password: string
    ) {
        return this.authService.register(email, password)
    }

    @Post('login') // http://localhost:3000/auth/login
    async login(
        @Body('email') email: string,
        @Body('password') password: string
    ) {
        return this.authService.login(email, password)
    }
}
