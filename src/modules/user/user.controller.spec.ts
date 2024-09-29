import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            changePassword: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });
  describe('create', () => {
    it('should call userService.create with the correct arguments', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Tat',
        lastName: 'als',
        email: 'test@example.com',
        password: 'password',
      };
      await controller.create(createUserDto);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
  describe('changeUsersPassword', () => {
    it('should call userService.changePassword with the correct arguments', async () => {
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'OLDpass12!',
        newPassword: 'NEWpass12!',
      };
      const id = 1;
      await controller.changeUsersPassword(changePasswordDto, id);
      expect(userService.changePassword).toHaveBeenCalledWith(
        changePasswordDto,
        id,
      );
    });
  });

  describe('deleteUser', () => {
    it('should call userService.deleteUser with the correct arguments', async () => {
      const id = 1;
      await controller.deleteUser(id);
      expect(userService.deleteUser).toHaveBeenCalledWith(id);
    });
  });
});
