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
} from '@nestjs/common';
import { User } from '@prisma/client';

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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role([Roles.ADMIN])
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard)
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role([Roles.ADMIN])
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
