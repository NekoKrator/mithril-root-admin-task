import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt/jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/modules/user/entities/users.entity'
import { UserModule } from 'src/modules/user/user.module'
import dotenv from 'dotenv'
import { MailService } from '../mail/mail.service'
import { UserService } from '../user/user.service'

dotenv.config()

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET!,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
        }),
        UserModule,
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, MailService, UserService],
    exports: [AuthService],
})
export class AuthModule { }
