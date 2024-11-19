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
import { Skill } from '@prisma/client';
import { CreateSkillDto } from './dto/createSkill.dto';
import { UpdateSkillNameDto } from './dto/updateSkillName.dto';
import { UpdateSkillLevelDto } from './dto/updateSkillLevel.dto';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post(':userId')
  @UseGuards(JwtAuthGuard)
  async createSkill(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() skillDto: CreateSkillDto,
  ): Promise<Skill> {
    return this.skillService.create(skillDto, userId);
  }

  @Put('name/:id')
  @UseGuards(JwtAuthGuard)
  async updateSkill(
    @Param('id', ParseIntPipe) skillId: number,
    @Body() updateSkillDto: UpdateSkillNameDto,
  ): Promise<Skill> {
    return this.skillService.updateSkill(skillId, updateSkillDto);
  }

  @Put('level/:id')
  @UseGuards(JwtAuthGuard)
  async updateSkillLevel(
    @Param('id', ParseIntPipe) skillId: number,
    @Body() updateSkillDto: UpdateSkillLevelDto,
  ): Promise<Skill> {
    return this.skillService.updateSkillLevel(skillId, updateSkillDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeSkill(
    @Param('id', ParseIntPipe) skillId: number,
  ): Promise<{ deleted: boolean }> {
    await this.skillService.remove(skillId);
    return { deleted: true };
  }
}
