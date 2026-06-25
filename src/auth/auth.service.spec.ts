import * as bcrypt from 'bcrypt';
import type { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import type { PrismaService } from '../prisma/prisma.service';
import type { User } from '../../generated/prisma/client';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let prisma: { user: { findUnique: jest.Mock } };
  let jwtService: { sign: jest.Mock };
  let service: AuthService;
  const compareMock = bcrypt.compare as jest.Mock;

  const makeUser = (overrides: Partial<User> = {}): User =>
    ({
      id: 'user-1',
      email: 'mira@example.com',
      firstName: 'Mira',
      lastName: 'Stone',
      isTemporaryEmail: false,
      passwordHash: 'hashed-password',
      ...overrides,
    }) as User;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
    };
    jwtService = {
      sign: jest.fn(),
    };
    service = new AuthService(
      prisma as unknown as PrismaService,
      jwtService as unknown as JwtService,
    );
    compareMock.mockReset();
  });

  it('signs a JWT payload and returns a public user for login', () => {
    jwtService.sign.mockReturnValue('jwt-token');
    const user = makeUser();

    const response = service.login(user);

    expect(jwtService.sign).toHaveBeenCalledWith({
      email: user.email,
      sub: user.id,
    });
    expect(response).toStrictEqual({
      token: 'jwt-token',
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isTemporaryEmail: user.isTemporaryEmail,
      },
    });
  });

  it('omits lastName from the login response when the user has none', () => {
    jwtService.sign.mockReturnValue('jwt-token');

    const response = service.login(makeUser({ lastName: null }));

    expect(response.user).toStrictEqual({
      email: 'mira@example.com',
      firstName: 'Mira',
      isTemporaryEmail: false,
    });
  });

  it('returns the user when email exists and password matches', async () => {
    const user = makeUser();
    prisma.user.findUnique.mockResolvedValue(user);
    compareMock.mockResolvedValue(true);

    await expect(
      service.validateUser(user.email, 'plain-password'),
    ).resolves.toBe(user);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: user.email },
    });
    expect(compareMock).toHaveBeenCalledWith(
      'plain-password',
      user.passwordHash,
    );
  });

  it('returns null when no user exists for the email', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.validateUser('missing@example.com', 'plain-password'),
    ).resolves.toBeNull();

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'missing@example.com' },
    });
    expect(compareMock).not.toHaveBeenCalled();
  });

  it('returns null when the password does not match', async () => {
    const user = makeUser();
    prisma.user.findUnique.mockResolvedValue(user);
    compareMock.mockResolvedValue(false);

    await expect(
      service.validateUser(user.email, 'wrong-password'),
    ).resolves.toBeNull();

    expect(compareMock).toHaveBeenCalledWith(
      'wrong-password',
      user.passwordHash,
    );
  });
});
