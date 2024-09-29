import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() authDto: AuthDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(res, authDto);
  }

  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }
}
