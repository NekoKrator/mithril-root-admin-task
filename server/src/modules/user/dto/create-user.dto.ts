import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    IsEnum,
    IsOptional,
    IsBoolean,
} from 'class-validator'
import { UserRole } from '../entities/users.entity'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
    @ApiProperty({
        example: 'john.doe@mail.com',
        required: true,
    })
    @IsEmail()
    email: string

    @ApiProperty({
        example: '12345',
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

    @IsOptional()
    @IsBoolean()
    isSent?: boolean
}
