import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    IsEnum,
} from 'class-validator'
import { UserRole } from '../entities/users.entity'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
    @IsEmail()
    email: string

    @ApiProperty({
        example: 'john.doe@mail.com',
        required: true,
    })
    @IsString()
    @MinLength(4)
    @MaxLength(32)
    password: string

    @ApiProperty({
        example: 'John Doe',
        required: true,
    })
    @IsString()
    @MinLength(4)
    @MaxLength(16)
    name: string

    @ApiProperty({
        example: 'root_admin | admin | user',
        enum: UserRole,
    })
    @IsEnum(UserRole)
    role: UserRole
}
