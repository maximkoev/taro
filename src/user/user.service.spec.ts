import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import type { PrismaService } from '../prisma/prisma.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UserService', () => {
  let prisma: { user: { create: jest.Mock } };
  let service: UserService;
  const hashMock = bcrypt.hash as jest.Mock;

  beforeEach(() => {
    prisma = {
      user: {
        create: jest.fn(),
      },
    };
    service = new UserService(prisma as unknown as PrismaService);
    hashMock.mockReset();
  });

  it('hashes the password, creates the user, and returns a success message', async () => {
    hashMock.mockResolvedValue('hashed-password');
    prisma.user.create.mockResolvedValue({
      firstName: 'Mira',
      lastName: 'Stone',
    });

    await expect(
      service.create({
        firstName: 'Mira',
        lastName: 'Stone',
        email: 'mira@example.com',
        password: 'secret1',
      }),
    ).resolves.toStrictEqual({ message: 'User Mira Stone created' });

    expect(hashMock).toHaveBeenCalledWith('secret1', 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'mira@example.com',
        firstName: 'Mira',
        lastName: 'Stone',
        passwordHash: 'hashed-password',
      },
    });
  });
});
