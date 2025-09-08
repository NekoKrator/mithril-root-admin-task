import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { MailService } from '../mail/mail.service'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../user/entities/users.entity'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email)
        const isValid = user && (await bcrypt.compare(password, user.password))

        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload = { sub: user.id, role: user.role }
        const access_token = this.jwtService.sign(payload, { expiresIn: '1h' })

        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        }
    }

    async sendPassword(email: string) {
        const user = await this.usersService.findByEmail(email)

        if (!user) {
            return {
                message: 'If this email exists, a reset link has been sent',
            }
        }

        const tokenTtl = '1h'
        const resetToken = this.jwtService.sign(
            { sub: user.id },
            { expiresIn: tokenTtl }
        )

        await this.mailService.sendPasswordResetEmail(
            user.email,
            user.name,
            resetToken,
            tokenTtl
        )

        return { message: 'If this email exists, a reset link has been sent' }
    }

    async resetPassword(token: string, newPassword: string) {
        const payload = this.jwtService.verify(token)
        const userId = payload.sub
        const user = await this.userRepository.findOne({
            where: { id: userId },
        })

        if (!user) {
            return `User with id ${userId} not found`
        }

        const hashed = await bcrypt.hash(newPassword, 10)

        user.password = hashed
        await this.userRepository.update(userId, { password: hashed })

        return true
    }
}
