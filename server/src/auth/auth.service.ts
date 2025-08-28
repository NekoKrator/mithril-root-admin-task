import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common'
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async register(email: string, password: string) {
        const existingUser = await this.usersService.findByEmail(email)

        if (existingUser) {
            throw new BadRequestException('Email already in use')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.usersService.create({
            email,
            password: hashedPassword,
        })

        return { id: user.id, email: user.email }
    }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email)

        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload = { sub: user.id, role: user.role }
        const token = this.jwtService.sign(payload)

        return { access_token: token }
    }
}
