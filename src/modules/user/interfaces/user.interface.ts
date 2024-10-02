import { Status } from '../../../shared/enums/status';
import { Roles } from '../../../shared/enums/roles';

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  status: Status;
  role: Roles;
}
