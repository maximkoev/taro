import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import type { AuthService } from './auth.service';
import type { User } from '../../generated/prisma/client';

describe('LocalStrategy', () => {
  let authService: { validateUser: jest.Mock };
  let strategy: LocalStrategy;

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
      validateUser: jest.fn(),
    };
    strategy = new LocalStrategy(authService as unknown as AuthService);
  });

  it('returns the validated user', async () => {
    authService.validateUser.mockResolvedValue(user);

    await expect(strategy.validate(user.email, 'plain-password')).resolves.toBe(
      user,
    );

    expect(authService.validateUser).toHaveBeenCalledWith(
      user.email,
      'plain-password',
    );
  });

  it('throws UnauthorizedException when credentials are invalid', async () => {
    authService.validateUser.mockResolvedValue(null);

    await expect(
      strategy.validate(user.email, 'wrong-password'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
