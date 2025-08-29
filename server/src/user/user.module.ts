import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/users.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { MailModule } from 'src/mail/mail.module'

@Module({
    imports: [TypeOrmModule.forFeature([User]), MailModule],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule { }
