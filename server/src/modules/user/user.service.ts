import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/users.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import * as bcrypt from 'bcrypt'
import { MailService } from 'src/modules/mail/mail.service'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mailService: MailService
    ) { }

    async create(data: CreateUserDto): Promise<User> {
        await this.mailService.sendEmail(data.email, data.name, data.password)

        const hashedPassword = await bcrypt.hash(data.password, 10)
        const newUser = this.userRepository.create({
            ...data,
            password: hashedPassword,
        })

        return this.userRepository.save(newUser)
    }

    async list() {
        return this.userRepository.find()
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } })
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } })
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
}
