import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cron } from '@nestjs/schedule'
import { MailService } from 'src/modules/mail/mail.service'
import { NoteService } from 'src/modules/note/note.service'
import { UserService } from 'src/modules/user/user.service'
import { Repository } from 'typeorm'
import { Note } from '../../note/entities/notes.entities'

// interface NoteId {
//     title: string
//     content: string
//     reminderDate: Date | null
//     id: string
//     authorId: string
// }

@Injectable()
export class TaskService {
    constructor(
        private readonly noteService: NoteService,
        private readonly mailService: MailService,
        private readonly userService: UserService,

        @InjectRepository(Note)
        private readonly noteRepository: Repository<Note>
    ) { }

    @Cron('*/10 * * * * *')
    async handleCronJob() {
        const notes = await this.noteRepository.find()
        const now = new Date()

        notes
            .filter((note) => note.reminderDate && note.isSent === false)
            .forEach((note) => {
                if (!note.reminderDate) {
                    return
                }

                const reminderDate = new Date(note.reminderDate)

                if (reminderDate <= now) {
                    this.reminderIsOut(note)
                }
            })
    }

    private async reminderIsOut(note: Note) {
        const author = await this.userService.findById(note.authorId)

        await this.mailService.sendReminder(
            author!.email,
            note.title,
            note.content,
            String(note.reminderDate)
        )

        // await this.noteService.delete(note.id, author!.id)
        // await this.noteService.update(
        //     note.id,
        //     (note.reminderDate = null),
        //     author!.id
        // )

        // await this.noteService.update(isSent = true)

        note.isSent = true

        return await this.noteRepository.save(note)

        return
    }
}
