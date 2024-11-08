import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Delete,
  Get,
} from '@nestjs/common';
import { Character, User } from '@prisma/client';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../../shared/decorators/role';
import { Roles } from '../../shared/enums/roles';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ReqUser } from '../../shared/decorators/req-user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  get(@Param('id', ParseIntPipe) userId: number): Promise<User> {
    const user = this.userService.getUserById(userId);
    return user;
  }

  @Get('character/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  getCharacter(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Character[]> {
    const user = this.userService.getCharacterByUserId(userId);
    return user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role([Roles.ADMIN, Roles.VIEWER])
  changeOwnPassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @ReqUser() user: User,
  ) {
    return this.userService.changePassword(changePasswordDto, user.id);
  }

  @Patch('password/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role([Roles.ADMIN])
  changeUsersPassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.changePassword(changePasswordDto, id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role([Roles.ADMIN, Roles.VIEWER])
  deleteUser(
    // @Param('id', ParseIntPipe) id: number
    @ReqUser() user: User,
  ) {
    return this.userService.deleteUser(user.id);
  }
}
