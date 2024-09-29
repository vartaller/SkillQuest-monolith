import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import { Roles } from 'src/shared/enums/roles';
import { Status } from 'src/shared/enums/status';
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRATION },
        }),
        UserModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, PrismaService, JwtStrategy],
      exports: [JwtModule, JwtStrategy],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
  it('should return user and token when credentials are correct', async () => {
    const user = {
      id: 1,
      email: 'test@example.com',
      firstName: 'lalal',
      lastName: 'lala',
      password: 'Tats12!',
      role: Roles.VIEWER,
      status: Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const tokens = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };
    const res: Response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    } as any;
    const authDto = {
      email: 'test@example.com',
      password: 'Tats12!',
    };
    jest
      .spyOn(authService, 'login')
      .mockImplementation(() =>
        Promise.resolve({ user, token: tokens.accessToken }),
      );
    const result = await authController.login(authDto, res);
    expect(result).toEqual({ user, token: tokens.accessToken });
  });
});
