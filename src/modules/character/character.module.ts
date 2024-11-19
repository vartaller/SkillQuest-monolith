import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { PrismaService } from '../../shared/services/prisma.service';

@Module({
  providers: [CharacterService, PrismaService],
  controllers: [CharacterController],
  exports: [CharacterService],
})
export class CharacterModule {}
