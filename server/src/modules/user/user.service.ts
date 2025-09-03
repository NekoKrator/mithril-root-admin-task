import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User, UserRole } from './entities/users.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import * as bcrypt from 'bcrypt'
import { MailService } from 'src/modules/mail/mail.service'
import type { CurrentUser } from '../../interfaces/current-user'

const baseFindOptions = {
    relations: ['createdBy'],
    select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdBy: {
            id: true,
            email: true,
        },
    },
}

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mailService: MailService
    ) { }

    async create(data: CreateUserDto, creatorId: string): Promise<User> {
        const creator = await this.userRepository.findOneBy({ id: creatorId })

        if (!creator) {
            throw new NotFoundException(`Creator not found`)
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)
        const newUser = this.userRepository.create({
            ...data,
            password: hashedPassword,
            createdBy: creator,
        })

        await this.mailService.sendEmail(
            data.email,
            data.name,
            data.password,
            creator?.email
        )

        return this.userRepository.save(newUser)
    }

    async list(currentUser: CurrentUser) {
        if (currentUser.role === UserRole.ADMIN) {
            return this.userRepository.find({
                ...baseFindOptions,
                where: { createdById: currentUser.userId },
            })
        }

        return this.userRepository.find(baseFindOptions)
    }

    async find(id: string): Promise<User | string> {
        const user = await this.userRepository.findOne({ where: { id } })

        if (!user) {
            // throw new NotFoundException(`User with id ${id} not found`)
            return `User with id ${id} not found`
        }

        return user
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } })
    }

    async update(id: string, dto: UpdateUserDto) {
        const user = await this.userRepository.findOne({ where: { id } })

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`)
        }

        if (dto.password) {
            dto.password = await bcrypt.hash(dto.password, 10)
        }

        Object.assign(user, dto)

        return await this.userRepository.save(user)
    }

    async delete(id: string) {
        const user = await this.userRepository.findOne({ where: { id } })

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`)
        }

        return await this.userRepository.remove(user)
    }
}
