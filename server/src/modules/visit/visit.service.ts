import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Visit } from './entities/visit.entity'
import { Repository } from 'typeorm'
import { User } from '../user/entities/users.entity'
import { Note } from '../note/entities/notes.entities'

@Injectable()
export class VisitService {
    constructor(
        @InjectRepository(Visit)
        private readonly visitRepository: Repository<Visit>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Note)
        private readonly noteRepository: Repository<Note>
    ) { }

    async create(noteId: string, visitorId: string) {
        const user = await this.userRepository.findOne({
            where: { id: visitorId },
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        const note = await this.noteRepository.findOne({
            where: { id: noteId },
        })

        if (!note) {
            throw new NotFoundException('Note not found')
        }

        const visit = await this.visitRepository.findOneBy({
            noteId,
            visitorId,
        })
        if (visit || note.authorId === visitorId) {
            return
        }

        const newPageVisit = this.visitRepository.create({ noteId, visitorId })

        return this.visitRepository.save(newPageVisit)
    }

    async getById(authorId: string) {
        return this.visitRepository.find({
            where: { note: { authorId } },
            relations: ['note', 'visitor'],
            order: { createdAt: 'DESC' },
        })
    }

    async update(id: string) { }
}
