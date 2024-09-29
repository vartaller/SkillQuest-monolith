import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../../shared/services/prisma.service';
import { IGetBy } from '../../shared/interfaces/get-by';
import { CreateUserDto } from './dto/create-user.dto';
import { randomString } from '../../shared/utils/generate-password';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ERRORS } from '../../shared/constants/errors';
import { MESSAGES } from '../../shared/constants/messages';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  getBy({ key, value }: IGetBy): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        [key]: value,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const existedUser = await this.getBy({
      key: 'email',
      value: createUserDto.email,
    });
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
    const existUser = await this.getBy({ key: 'id', value: id });
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
    const existedUser = await this.getBy({
      key: 'id',
      value: id,
    });

    if (!existedUser) {
      throw new NotFoundException(ERRORS.USER.NOT_EXIST);
    }

    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    return { message: MESSAGES.USER.USER_DELETED };
  }
}
