// import { Module } from '@nestjs/common'
// import { MailController } from './mail.controller'
// import { MailService } from './mail.service'

// @Module({
//     imports: [
//       MailerModule.forRoot({
//         transport: {
//           host: process.env.SMTP_HOST,
//           secure: false,
//           auth: {

//           }
//         },
//         template: {
//           dir: join(__dirname, 'templates'),
//           adapter: new HandlebarsAdapter()
//         }
//       })
//     ]
//     controllers: [MailController],
//     providers: [MailService],
// })
// export class MailModule {}
