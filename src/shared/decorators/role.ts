import { SetMetadata } from '@nestjs/common';

import { Roles } from '../enums/roles';

export const Role = (roles: Roles[]) => SetMetadata('roles', roles);
