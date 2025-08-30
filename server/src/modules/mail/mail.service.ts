import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmail(userEmail: string, userName: string, userPassword: string) {
        await this.mailerService.sendMail({
            to: userEmail,
            subject: 'Your account was created',
            template: './welcome',
            context: {
                email: userEmail,
                name: userName,
                password: userPassword,
            },
        })
    }
}
