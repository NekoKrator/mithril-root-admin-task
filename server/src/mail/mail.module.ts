import { Module } from '@nestjs/common'
import { MailerModule } from '@nestjs-modules/mailer'
import { MailController } from './mail.controller'
import { MailService } from './mail.service'
import * as nodemailer from 'nodemailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { join } from 'path'

let testAccount = {}

nodemailer.createTestAccount().then((account) => {
    testAccount = account
})

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async () => {
                const testAccount = await nodemailer.createTestAccount()
                return {
                    transport: {
                        host: testAccount.smtp.host,
                        port: testAccount.smtp.port,
                        secure: testAccount.smtp.secure,
                        auth: {
                            // user: testAccount.user,
                            // pass: testAccount.pass,
                            user: process.env.SMTP_USER,
                            pass: process.env.SMTP_PASSWORD,
                        },
                    },
                    defaults: {
                        from: `"No Reply" <${testAccount.user}>`,
                    },
                    template: {
                        // dir: join(process.cwd(), 'templates'),
                        dir: 'src\\templates',
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                }
            },
        }),
    ],
    controllers: [MailController],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }