import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Note } from './entities/notes.entities'
import { User, UserRole } from '../user/entities/users.entity'
import { Repository } from 'typeorm'
import { CreateNoteDto } from './dto/create-note.dto'
import { UpdateNoteDto } from './dto/update-note.dto'
import type { CurrentUser } from 'src/interfaces/current-user'

const baseFindOptions = {
    select: {
        id: true,
        title: true,
        content: true,
        reminderDate: true,
        author: false,
        authorId: true,
    },
}

@Injectable()
export class NoteService {
    constructor(
        @InjectRepository(Note)
        private readonly noteRepository: Repository<Note>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async create(data: CreateNoteDto, creatorId: string): Promise<Note> {
        const creator = await this.userRepository.findOneBy({ id: creatorId })

        if (!creator) {
            throw new NotFoundException('Creator not found')
        }

        const newNote = this.noteRepository.create({
            ...data,
            author: creator,
        })

        return this.noteRepository.save(newNote)
    }

    async getById(id: string) {
        const note = await this.noteRepository.findOne({
            where: { id },
            relations: ['author'],
        })

        if (!note) {
            throw new NotFoundException(`Note with id ${id} not found`)
        }

        return this.noteRepository.findOne({ where: { id } })
    }

    async getNotes(id: string) {
        const user = await this.userRepository.findOne({ where: { id } })

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`)
        }

        return this.noteRepository.find({ where: { authorId: id } })
    }

    async list(currentUser: CurrentUser) {
        if (
            currentUser.role === UserRole.ADMIN ||
            currentUser.role === UserRole.ROOT_ADMIN
        ) {
            return await this.noteRepository.find({ ...baseFindOptions })
        }
    }

    async update(id: string, dto: UpdateNoteDto, requestorId: string) {
        console.log(dto)
        const note = await this.noteRepository.findOne({ where: { id } })

        if (!note) {
            throw new NotFoundException(`Note with id ${id} not found`)
        }

        const requestor = await this.userRepository.findOne({
            where: { id: requestorId },
        })

        if (!requestor) {
            throw new NotFoundException('User not found')
        }

        if (note.authorId !== requestor.id) {
            throw new NotFoundException("You don't have permission")
        }

        if (dto.reminderDate === note.reminderDate?.toISOString()) {
            note.isSent = true
        } else {
            note.isSent = false
        }

        Object.assign(note, dto)

        return await this.noteRepository.save(note)
    }

    async delete(id: string, requestorId: string) {
        const requestor = await this.userRepository.findOneBy({
            id: requestorId,
        })

        if (!requestor) {
            throw new NotFoundException('User not found')
        }

        const note = await this.noteRepository.findOne({
            where: { id },
            relations: ['author'],
        })

        if (!note) {
            throw new NotFoundException('Note not found')
        }

        if (note.author.id !== requestor.id) {
            throw new NotFoundException("You don't have permission")
        }

        return this.noteRepository.remove(note)
    }
}
