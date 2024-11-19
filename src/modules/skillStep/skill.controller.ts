import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Skill, User } from '@prisma/client';
import { CreateSkillDto } from './dto/createSkill.dto';
import { UpdateSkillNameDto } from './dto/updateSkillName.dto';
import { UpdateSkillLevelDto } from './dto/updateSkillLevel.dto';
import { ReqUser } from '../../shared/decorators/req-user';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get(':skillId')
  @UseGuards(JwtAuthGuard)
  async getSkill(
    @Param('skillId', ParseIntPipe) skillId: number,
  ): Promise<Skill> {
    return this.skillService.getSkill(skillId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createSkill(
    @Body() skillDto: CreateSkillDto,
    @ReqUser() user: User,
  ): Promise<Skill> {
    return this.skillService.create(skillDto, user.id);
  }

  @Put('name/:id')
  @UseGuards(JwtAuthGuard)
  async updateSkill(
    @Param('id', ParseIntPipe) skillId: number,
    @Body() updateSkillDto: UpdateSkillNameDto,
    @ReqUser() user: User,
  ): Promise<Skill> {
    return this.skillService.updateSkill(skillId, updateSkillDto, user.id);
  }

  @Put('level/:id')
  @UseGuards(JwtAuthGuard)
  async updateSkillLevel(
    @Param('id', ParseIntPipe) skillId: number,
    @Body() updateSkillDto: UpdateSkillLevelDto,
    @ReqUser() user: User,
  ): Promise<Skill> {
    return this.skillService.updateSkillLevel(skillId, updateSkillDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeSkill(
    @Param('id', ParseIntPipe) skillId: number,
    @ReqUser() user: User,
  ): Promise<{ deleted: boolean }> {
    await this.skillService.remove(skillId, user.id);
    return { deleted: true };
  }
}
