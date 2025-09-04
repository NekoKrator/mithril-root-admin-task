import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmail(
        userEmail: string,
        userName: string,
        userPassword: string,
        userCreator: string
    ) {
        await this.mailerService.sendMail({
            to: userEmail,
            subject: 'Your account was created',
            template: './welcome',
            context: {
                email: userEmail,
                name: userName,
                password: userPassword,
                creator: userCreator,
            },
        })
    }

    async sendReminder(
        userName: string,
        noteTitle: string,
        noteContent: string,
        noteTime: string
    ) {
        await this.mailerService.sendMail({
            to: userName,
            subject: 'Reminder time has expired!',
            template: './reminder',
            context: {
                name: userName,
                title: noteTitle,
                content: noteContent,
                time: noteTime,
            },
        })
    }

    async sendPasswordResetEmail(
        userEmail: string,
        userName: string,
        resetToken: string,
        expiresIn: string
    ) {
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

        await this.mailerService.sendMail({
            to: userEmail,
            subject: 'Password reset request',
            template: './reset',
            context: {
                email: userEmail,
                name: userName,
                link: resetLink,
                expiresIn,
            },
        })
    }
}
