import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UserService } from 'src/modules/user/user.service';
import { ERRORS } from '../../../shared/constants/errors';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(public userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ id, type }) {
    const user = await this.userService.getById(id);
    if (!user) throw new BadRequestException(ERRORS.USER.NOT_EXIST);

    return { user, type };
  }
}
