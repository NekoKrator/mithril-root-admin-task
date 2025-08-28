import {
    Body,
    Controller,
    Get,
    // Param,
    // Patch,
    Post,
    UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
// import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private usersService: UserService) {}

    @Post()
    @Roles('root_admin')
    async create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto)
    }

    @Get()
    @Roles('root_admin')
    list() {
        return this.usersService.list()
    }

    // @Patch(':id')
    // @Roles('root_admin')
    // update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    //     return this.users.update(id, dto)
    // }
}
