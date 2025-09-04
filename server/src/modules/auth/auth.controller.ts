import { Controller, Post, Body, BadRequestException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post()
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password)
    }

    @Post('forgot')
    async forgot(@Body() dto: ForgotPasswordDto) {
        return this.authService.sendPassword(dto.email)
    }

    @Post('reset')
    async resetPassword(@Body() dto: ResetPasswordDto) {
        const success = await this.authService.resetPassword(
            dto.token,
            dto.password
        )

        if (!success) {
            throw new BadRequestException('Invalid or expired token')
        }

        return { message: 'Password successfully reset' }
    }
}
