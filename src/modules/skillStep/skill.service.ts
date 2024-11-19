import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { ERRORS } from '../../shared/constants/errors';
import { CreateSkillDto } from './dto/createSkill.dto';
import { CharacterService } from '../character/character.service';
import { Character, Skill } from '@prisma/client';
import { UpdateSkillNameDto } from './dto/updateSkillName.dto';
import { UpdateSkillLevelDto } from './dto/updateSkillLevel.dto';
import { SKILL_LEVEL_FACTOR } from './constants/SKILLlevelFactor';

@Injectable()
export class SkillService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly characterService: CharacterService,
  ) {}

  async create(skillDto: CreateSkillDto, userId: number) {
    const existedCharacter: Character = await this.checkCharacterPermission(
      userId,
      skillDto.characterId,
    );

    try {
      return this.prisma.skill.create({
        data: {
          name: skillDto.name,
          character: {
            connect: {
              id: existedCharacter.id,
            },
          },
        },
      });
    } catch (err) {
      throw new Error(`${ERRORS.SKILL.NOT_EXIST} ${err.message}`);
    }
  }

  async getSkill(skillId: number) {
    try {
      return this.prisma.skill.findUnique({
        where: { id: skillId },
      });
    } catch (err) {
      throw new Error(`${ERRORS.SKILL.NOT_EXIST} ${err.message}`);
    }
  }

  async updateSkill(skillId: number, updateNameDto: UpdateSkillNameDto) {
    await this.checkCharacterPermission(
      updateNameDto.userId,
      updateNameDto.characterId,
    );

    const existedSkill: Skill = await this.getSkill(skillId);

    if (!existedSkill || existedSkill.characterId != updateNameDto.characterId)
      throw new BadRequestException(ERRORS.SKILL.NOT_EXIST);

    try {
      return this.prisma.skill.update({
        where: { id: skillId },
        data: {
          ...updateNameDto,
        },
      });
    } catch (err) {
      throw new Error(`${ERRORS.SKILL.NOT_EXIST} ${err.message}`);
    }
  }

  async updateSkillLevel(
    skillId: number,
    updateSkillLevelDto: UpdateSkillLevelDto,
    exp: number,
  ) {
    const existedCharacter: Character = await this.checkCharacterPermission(
      updateSkillLevelDto.userId,
      updateSkillLevelDto.characterId,
    );

    const existedSkill: Skill = await this.getSkill(skillId);

    if (
      !existedSkill ||
      existedSkill.characterId != updateSkillLevelDto.characterId
    )
      throw new BadRequestException(ERRORS.SKILL.NOT_EXIST);

    let currentPoints = existedSkill.currentPoints;
    let level = existedSkill.level;
    let pointsToNextLevel = existedSkill.pointsToNextLevel;

    if (exp + currentPoints >= pointsToNextLevel) {
      level++;
      currentPoints = exp + currentPoints - pointsToNextLevel;
      pointsToNextLevel = pointsToNextLevel * SKILL_LEVEL_FACTOR;
    } else {
      currentPoints += exp;
    }

    try {
      return this.prisma.skill.update({
        where: { id: skillId },
        data: {
          level: level,
          currentPoints: currentPoints,
          pointsToNextLevel: pointsToNextLevel,
        },
      });
    } catch (err) {
      throw new Error(`${ERRORS.SKILL.NOT_EXIST} ${err.message}`);
    }
  }

  async remove(skillId: number) {
    return this.prisma.skill.delete({
      where: { id: skillId },
    });
  }

  private async checkCharacterPermission(
    userId: number,
    characterId: number,
  ): Promise<Character> {
    const existedCharacter: Character =
      await this.characterService.getById(characterId);

    if (!existedCharacter || existedCharacter.userId != userId)
      throw new BadRequestException(ERRORS.CHARACTER.NOT_EXIST);

    return existedCharacter;
  }
}
