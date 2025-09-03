import { Controller } from '@nestjs/common'
import { NoteService } from './note.service'
import { CreateNoteDto } from './dto/create-note.dto'
import {
  Body,
  Req,
  Post,
  UseGuards,
  Param,
  Delete,
  Get,
  Patch,
} from '@nestjs/common'
import type { RequestWithUser } from 'src/interfaces/request-with-user'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { UpdateNoteDto } from './dto/update-note.dto'

@Controller('notes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NoteController {
  constructor(private noteService: NoteService) { }

  @Post()
  async create(@Body() dto: CreateNoteDto, @Req() req: RequestWithUser) {
    const creatorId = req.user.userId
    return this.noteService.create(dto, creatorId)
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.noteService.getById(id)
  }

  @Get('/user/:id')
  async getNotes(@Param('id') id: string) {
    return this.noteService.getNotes(id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
    @Req() req: RequestWithUser
  ) {
    const requestorId = req.user.userId
    return this.noteService.update(id, dto, requestorId)
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: RequestWithUser) {
    const requestorId = req.user.userId
    return this.noteService.delete(id, requestorId)
  }
}
