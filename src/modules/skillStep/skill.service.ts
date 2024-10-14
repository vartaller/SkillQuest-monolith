import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { ERRORS } from '../../shared/constants/errors';
import { SkillDto } from './dto/skill.dto';
import { CharacterService } from '../character/character.service';
import { Character } from '@prisma/client';

@Injectable()
export class SkillService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly characterService: CharacterService,
  ) {}

  async create(skillDto: SkillDto, userId: number) {
    const existedCharacter: Character =
      await this.characterService.getByUserId(userId);

    if (existedCharacter)
      throw new BadRequestException(ERRORS.CHARACTER.NOT_EXIST);

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
  }

  async change(skillId: number, updateData: Partial<SkillDto>) {
    return this.prisma.skill.update({
      where: { id: skillId },
      data: {
        ...updateData,
      },
    });
  }

  async remove(skillId: number) {
    return this.prisma.skill.delete({
      where: { id: skillId },
    });
  }
}
