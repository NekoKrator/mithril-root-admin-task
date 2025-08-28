import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator'
import { UserRole } from '../entities/users.entity'

export class CreateUserDto {
    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    password: string

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole
}
