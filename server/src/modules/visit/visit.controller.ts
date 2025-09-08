import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { VisitService } from './visit.service'
import type { RequestWithUser } from '../../interfaces/request-with-user'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'

@Controller('visit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VisitController {
  constructor(private visitService: VisitService) { }

  @Post(':id')
  async create(@Param('id') id: string, @Req() req: RequestWithUser) {
    const visitorId = req.user.userId

    return this.visitService.create(id, visitorId)
  }

  @Get()
  async getById(@Req() req: RequestWithUser) {
    const requestorId = req.user.userId

    return await this.visitService.getById(requestorId)
  }

  @Patch(':id')
  async watched(@Param('id') id: string) {
    return this.visitService.update(id)
  }
}
