import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TOKEN_TYPES } from '../../../shared/constants/general';
import { ERRORS } from '../../../shared/constants/errors';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException(info.message);
    }

    if (user.type !== TOKEN_TYPES.ACCESS_TOKEN) {
      throw err || new UnauthorizedException(ERRORS.AUTH.NO_ACCESS_TOKEN);
    }

    return user;
  }
}
