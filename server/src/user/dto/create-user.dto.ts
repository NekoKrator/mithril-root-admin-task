import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator'
import { UserRole } from '../entities/users.entity'

export class CreateUserDto {
    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    password: string

    @IsString()
    @MinLength(6)
    name: string

    @IsEnum(UserRole)
    role: UserRole
}
