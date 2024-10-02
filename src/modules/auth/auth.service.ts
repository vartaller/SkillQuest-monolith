import { Request, Response } from 'express';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { AuthDto } from './dto/auth.dto';
import { ITokens } from './interfaces/tokens';
import { Status } from '../../shared/enums/status';
import { UserService } from '../user/user.service';
import { ERRORS } from '../../shared/constants/errors';
import { MESSAGES } from '../../shared/constants/messages';
import { TOKEN_TYPES } from '../../shared/constants/general';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(res: Response, authDto: AuthDto) {
    await this.validateUser(authDto);

    const user = await this.userService.getByEmail(authDto.email);
    if (!user) throw new BadRequestException(ERRORS.AUTH.WRONG_CREDENTIALS);

    const tokens = this.createTokens(user);
    delete user.password;

    return { user, token: this.setToken(res, tokens) };
  }

  async logout(req: Request, res: Response) {
    // req.logout({ keepSessionInfo: false }, (err) => {
    //   return err;
    // });
    res.clearCookie(TOKEN_TYPES.REFRESH_TOKEN);
    return { message: MESSAGES.AUTH.LOGOUT_SUCCESS };
  }

  async validateUser({ email, password }: AuthDto): Promise<User> {
    const user = await this.userService.getByEmail(email);
    if (!user) throw new BadRequestException(ERRORS.AUTH.WRONG_CREDENTIALS);

    this.checkUserStatus(user);
    await this.userService.verifyPassword(password, user.password);
    delete user.password;

    return user;
  }

  createTokens({ id, role }): ITokens {
    const accessToken = this.jwtService.sign(
      {
        id,
        role,
        type: TOKEN_TYPES.ACCESS_TOKEN,
      },
      { expiresIn: process.env.JWT_EXPIRATION },
    );
    const refreshToken = this.jwtService.sign(
      {
        id,
        role,
        type: TOKEN_TYPES.REFRESH_TOKEN,
      },
      { expiresIn: process.env.JWT_REFRESH_EXPIRATION },
    );

    return { accessToken, refreshToken };
  }

  setToken(res: Response, tokens: ITokens) {
    res.cookie(TOKEN_TYPES.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
    });
    return tokens.accessToken;
  }

  private checkUserStatus(user: User) {
    if (user.status === Status.DELETED) {
      throw new BadRequestException(ERRORS.AUTH.ACCOUNT_DELETED);
    }
  }
}
