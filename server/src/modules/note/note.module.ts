import { Module } from '@nestjs/common'
import { NoteService } from './note.service'
import { NoteController } from './note.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Note } from './entities/notes.entities'
// import { UserService } from '../user/user.service'
import { UserModule } from '../user/user.module'
import { User } from '../user/entities/users.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  providers: [NoteService],
  controllers: [NoteController],
  exports: [NoteService],
})
export class NoteModule { }
