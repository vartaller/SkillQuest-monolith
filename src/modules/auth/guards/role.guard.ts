import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Roles } from '../../../shared/enums/roles';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles =
      this.reflector.get<Roles[]>('roles', context.getHandler()) || [];
    if (!roles.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { user } = request.user;

    if (user.deleted || user.blocked) {
      return false;
    }

    return roles.includes(user.role);
  }
}
