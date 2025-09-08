import { Module } from '@nestjs/common'
import { VisitController } from './visit.controller'
import { VisitService } from './visit.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entities/users.entity'
import { Visit } from '../visit/entities/visit.entity'
import { UserModule } from '../user/user.module'
import { Note } from '../note/entities/notes.entities'
import { NoteModule } from '../note/note.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Visit]),
    TypeOrmModule.forFeature([Note]),
    UserModule,
    NoteModule,
  ],
  controllers: [VisitController],
  providers: [VisitService],
})
export class VisitModule { }
