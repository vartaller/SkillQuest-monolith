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

  async updateSkill(
    skillId: number,
    updateNameDto: UpdateSkillNameDto,
    userId: number,
  ) {
    await this.checkCharacterPermission(userId, updateNameDto.characterId);

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
    userId: number,
  ) {
    await this.checkCharacterPermission(
      userId,
      updateSkillLevelDto.characterId,
    );

    const existedSkill: Skill = await this.getSkill(skillId);

    if (
      !existedSkill ||
      existedSkill.characterId != updateSkillLevelDto.characterId
    )
      throw new BadRequestException(ERRORS.SKILL.NOT_EXIST);

    const exp = Number(updateSkillLevelDto.exp);
    let currentPoints = Number(existedSkill.currentPoints);
    let level = Number(existedSkill.level);
    let pointsToNextLevel = Number(existedSkill.pointsToNextLevel);

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

  async remove(skillId: number, userId: number) {
    const existedSkill: Skill = await this.getSkill(skillId);

    await this.checkCharacterPermission(userId, existedSkill.characterId);

    if (!existedSkill || existedSkill.characterId != existedSkill.characterId)
      throw new BadRequestException(ERRORS.SKILL.NOT_EXIST);

    return this.prisma.skill.delete({
      where: { id: skillId },
    });
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

  private async checkCharacterPermission(
    userId: number,
    characterId: number,
  ): Promise<Character> {
    const existedCharacter: Character =
      await this.characterService.getById(characterId);

    if (!existedCharacter || existedCharacter.userId != userId)
      throw new BadRequestException(
        ERRORS.CHARACTER.NOT_EXIST,
        `existedCharacter = ${existedCharacter}`,
      );

    return existedCharacter;
  }
}
