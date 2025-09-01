import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    Req,
    Delete,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import type { RequestWithUser } from '../../interfaces/request-with-user'

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private usersService: UserService) { }

    @Post()
    @Roles('root_admin', 'admin')
    async create(@Body() dto: CreateUserDto, @Req() req: RequestWithUser) {
        const creatorId = req.user.userId
        return this.usersService.create(dto, creatorId)
    }

    @Get()
    @Roles('root_admin', 'admin')
    async list(@Req() req: RequestWithUser) {
        return this.usersService.list(req.user)
    }

    @Patch(':id')
    @Roles('root_admin', 'admin')
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto)
    }

    @Delete(':id')
    @Roles('root_admin', 'admin')
    async delete(@Param('id') id: string) {
        return this.usersService.delete(id)
    }
}
