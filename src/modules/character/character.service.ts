import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { Character } from '@prisma/client';
import { CharacterDto } from './dto/сharacterName.dto';
import { ERRORS } from '../../shared/constants/errors';

@Injectable()
export class CharacterService {
  constructor(private readonly prisma: PrismaService) {}

  async create(characterDto: CharacterDto, userId: number): Promise<Character> {
    try {
      return await this.prisma.character.create({
        data: { userId: userId, ...characterDto },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async getById(characterId: number): Promise<Character> {
    try {
      return this.prisma.character.findUnique({
        where: {
          id: characterId,
        },
        include: {
          passiveEffects: true,
          activeEffects: true,
          skills: true,
        },
      });
    } catch (err) {
      throw new Error(`${ERRORS.CHARACTER.NOT_EXIST} ${err.message}`);
    }
  }
}
