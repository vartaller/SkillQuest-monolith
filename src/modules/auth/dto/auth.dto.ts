import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { IsPassword } from '../../../shared/decorators/is-password';

export class AuthDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsPassword()
  @IsNotEmpty()
  password: string;
}
