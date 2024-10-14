import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { Character } from '@prisma/client';
import { CharacterDto } from './dto/сharacterName.dto';

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

  async getByUserId(userId: number): Promise<Character> {
    try {
      // @ts-ignore
      return this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
