import { BadRequestException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import type { AuthService } from './auth.service';
import type { User } from '../../generated/prisma/client';

describe('AuthController', () => {
  let authService: { login: jest.Mock };
  let controller: AuthController;

  const user = {
    id: 'user-1',
    email: 'mira@example.com',
    firstName: 'Mira',
    lastName: null,
    isTemporaryEmail: false,
    passwordHash: 'hashed-password',
  } as User;

  beforeEach(() => {
    authService = {
      login: jest.fn(),
    };
    controller = new AuthController(authService as unknown as AuthService);
  });

  it('logs in the authenticated request user', () => {
    const response = {
      token: 'jwt-token',
      user: {
        email: user.email,
        firstName: user.firstName,
        isTemporaryEmail: user.isTemporaryEmail,
      },
    };
    authService.login.mockReturnValue(response);

    const result = controller.login({ user } as any);

    expect(result).toBe(response);
    expect(authService.login).toHaveBeenCalledWith(user);
  });

  it('throws BadRequestException when the guard did not attach a user', () => {
    expect(() => controller.login({} as any)).toThrow(BadRequestException);
    expect(authService.login).not.toHaveBeenCalled();
  });
});
