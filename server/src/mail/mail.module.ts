// import { Module } from '@nestjs/common'
// import { MailController } from './mail.controller'
// import { MailerModule } from '@nestjs-modules/mailer'
// import { MailService } from './mail.service'

// @Module({
//     imports: [
//         MailerModule.forRootAsync({
//             useFactory: () => ({
//                 transport: {
//                     host: process.env.SMTP_HOST,
//                     port: Number(process.env.SMTP_PORT),
//                     secure: false,
//                     tls: {
//                         rejectUnauthorized: false,
//                     },
//                 },
//                 defaults: {
//                     from: process.env.FROM,
//                 },
//                 template: {
//                     dir: __dirname + '/../../templates',
//                     adapter: new PugAdapter(),
//                     options: {
//                         strict: true,
//                     },
//                 },
//             }),
//         }),
//     ],
//     controllers: [MailController],
//     providers: [MailService],
//     exports: [MailService],
// })
// export class MailModule {}
