import { IsNotEmpty, IsString } from 'class-validator';
import { IsPassword } from '../../../shared/decorators/is-password';

export class ChangePasswordDto {
  @IsString()
  @IsPassword()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsPassword()
  @IsNotEmpty()
  newPassword: string;
}
