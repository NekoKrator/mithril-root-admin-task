import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/users.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async create(data: CreateUserDto): Promise<User> {
        // Хешируем пароль ПЕРЕД созданием объекта
        const hashedPassword = await bcrypt.hash(data.password, 10)

        const newUser = this.userRepository.create({
            ...data,
            password: hashedPassword
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

        // Если пароль передан, хешируем его
        if (dto.password) {
            dto.password = await bcrypt.hash(dto.password, 10)
        }

        Object.assign(user, dto)
        return await this.userRepository.save(user)
    }
}