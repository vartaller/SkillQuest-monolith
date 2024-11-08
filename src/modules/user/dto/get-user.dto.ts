import {
  IsEmail,
  IsEnum,
  IsNotEmpty, IsNumber,
  IsString,
} from 'class-validator';

import { Roles } from '../../../shared/enums/roles';
import { Status } from '../../../shared/enums/status';

export class GetUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // @IsString()
  // @IsEnum(Status)
  @IsNotEmpty()
  status: any;

  // @IsString()
  // @IsEnum(Roles)
  @IsNotEmpty()
  // role: Roles;
  role: any;

  @IsNotEmpty()
  createdAt: any;

  @IsNotEmpty()
  updatedAt: any;
}
