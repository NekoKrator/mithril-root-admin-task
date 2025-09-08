import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { UserController } from './modules/user/user.controller'
import { MailModule } from './modules/mail/mail.module'
import { NoteModule } from './modules/note/note.module'
import { ScheduleModule } from '@nestjs/schedule'
import { TaskService } from './modules/task/task/task.service'
import { Note } from './modules/note/entities/notes.entities'
import { VisitModule } from './modules/visit/visit.module'
import { Visit } from './modules/visit/entities/visit.entity'
import { VisitController } from './modules/visit/visit.controller'
import { VisitService } from './modules/visit/visit.service'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            ssl: {
                rejectUnauthorized: false,
            },
            autoLoadEntities: true,
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Visit]),
        TypeOrmModule.forFeature([Note]),
        ScheduleModule.forRoot(),
        MailModule,
        AuthModule,
        UserModule,
        NoteModule,
        VisitModule,
    ],
    controllers: [UserController],
    providers: [TaskService],
})
export class AppModule { }
