import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CharacterService } from './character.service';
import { Character, User } from '@prisma/client';
import { CharacterDto } from './dto/сharacterName.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ReqUser } from '../../shared/decorators/req-user';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createCharacter(
    @Body() characterDto: CharacterDto,
    @ReqUser() user: User,
  ): Promise<Character> {
    return this.characterService.create(characterDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getCharacterByUserId(@ReqUser() user: User): Promise<Character> {
    return this.characterService.getByUserId(user.id);
  }
}
