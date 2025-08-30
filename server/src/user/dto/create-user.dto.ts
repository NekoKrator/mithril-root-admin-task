import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    IsEnum,
} from 'class-validator'
import { UserRole } from '../entities/users.entity'

export class CreateUserDto {
    @IsEmail()
    email: string

    @IsString()
    @MinLength(4)
    @MaxLength(32)
    password: string

    @IsString()
    @MinLength(4)
    @MaxLength(16)
    name: string

    @IsString()
    @IsEnum(UserRole)
    role: UserRole
}
