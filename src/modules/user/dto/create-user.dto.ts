import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { Roles } from '../../../shared/enums/roles';
import { IsPassword } from '../../../shared/decorators/is-password';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @IsPassword()
  password?: string;

  @IsString()
  @IsEnum(Roles)
  @IsOptional()
  role?: Roles;
}
