import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { Character, User } from '@prisma/client';

import { PrismaService } from '../../shared/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { randomString } from '../../shared/utils/generate-password';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ERRORS } from '../../shared/constants/errors';
import { MESSAGES } from '../../shared/constants/messages';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  getUserById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        character: true,
      },
    });
  }

  async getCharacterByUserId(id: number): Promise<Character[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        character: {
          include: {
            passiveEffects: true,
            activeEffects: true,
            skills: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error(ERRORS.USER.NOT_EXIST);
    }

    return user.character;
  }

  getByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const existedUser = await this.getByEmail(createUserDto.email);
    if (existedUser) throw new BadRequestException(ERRORS.USER.ALREADY_EXIST);

    let password = createUserDto.password;
    if (!createUserDto.password) {
      password = randomString();
    }
    const encodedPassword = await this.encodePassword(password);

    const user = await this.prisma.user.create({
      data: { ...createUserDto, ...encodedPassword },
    });
    delete user.password;

    return user;
  }

  async changePassword(changePasswordDto: ChangePasswordDto, id: number) {
    const existUser = await this.getUserById(id);
    if (!existUser) throw new BadRequestException(ERRORS.USER.NOT_EXIST);

    await this.verifyPassword(
      changePasswordDto.currentPassword,
      existUser.password,
    );
    const encodedPassword = await this.encodePassword(
      changePasswordDto.newPassword,
    );

    await this.prisma.user.update({
      where: { id },
      data: {
        password: encodedPassword.password,
      },
    });

    return { message: MESSAGES.USER.PASSWORD_UPDATED };
  }

  async verifyPassword(password: string, hashedPassword: string) {
    if (!hashedPassword) {
      throw new BadRequestException(ERRORS.AUTH.WRONG_CREDENTIALS);
    }
    const isPasswordMatched = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatched) {
      throw new BadRequestException(ERRORS.AUTH.WRONG_CREDENTIALS);
    }
  }

  async encodePassword(password: string) {
    const encodedPassword = {
      password: (await bcrypt.hash(password, 10)) as string,
    };
    return encodedPassword;
  }

  async deleteUser(id: number) {
    const existedUser = await this.getUserById(id);

    if (!existedUser) {
      throw new NotFoundException(ERRORS.USER.NOT_EXIST);
    }

    console.log(existedUser);

    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    return { message: MESSAGES.USER.USER_DELETED };
  }
}
