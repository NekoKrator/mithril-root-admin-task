import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsString, MaxLength, IsOptional } from 'class-validator'

export class CreateNoteDto {
    @ApiProperty({
        example: 'Hello World!',
        required: true,
    })
    @IsString()
    @MaxLength(32)
    title: string

    @ApiProperty({
        example:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec feugiat.',
        required: true,
    })
    @IsString()
    content: string

    @ApiProperty({
        example: '01.01.2025',
    })
    @IsDate()
    @IsOptional()
    reminderDate: Date | null
}
