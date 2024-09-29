import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IUser } from '../../modules/user/interfaces/user.interface';

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUser => {
    const {
      user: { user },
    } = ctx.switchToHttp().getRequest();

    return user;
  },
);
