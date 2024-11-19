import { Module } from '@nestjs/common';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { CharacterModule } from '../character/character.module';

@Module({
  imports: [CharacterModule],
  providers: [SkillService, PrismaService],
  controllers: [SkillController],
})
export class SkillModule {}
