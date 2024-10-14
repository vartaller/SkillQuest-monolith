import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ReqUser } from '../../shared/decorators/req-user';
import { Skill, User } from '@prisma/client';
import { SkillDto } from './dto/skill.dto';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post('skill')
  @UseGuards(JwtAuthGuard)
  async createSkill(
    @Body() skillDto: SkillDto,
    @ReqUser() user: User,
  ): Promise<Skill> {
    return this.skillService.create(skillDto, user.id);
  }

  @Put('skill/:id')
  @UseGuards(JwtAuthGuard)
  async changeSkill(
    @Param('id', ParseIntPipe) skillId: number,
    @Body() updateSkillDto: SkillDto,
  ): Promise<Skill> {
    return this.skillService.change(skillId, updateSkillDto);
  }

  @Delete('skill/:id')
  @UseGuards(JwtAuthGuard)
  async removeSkill(
    @Param('id', ParseIntPipe) skillId: number,
  ): Promise<{ deleted: boolean }> {
    await this.skillService.remove(skillId);
    return { deleted: true };
  }
}
