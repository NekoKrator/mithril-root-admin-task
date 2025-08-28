import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/users.entity'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create(data: CreateUserDto): Promise<User> {
        const newUser = this.userRepository.create(data)
        return this.userRepository.save(newUser)
    }

    async list() {
        return this.userRepository.find()
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } })
    }
}
