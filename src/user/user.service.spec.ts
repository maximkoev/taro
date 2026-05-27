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
    prisma.user.create.mockResolvedValue({ username: 'mira' });

    await expect(
      service.create({ name: 'mira', password: 'secret1' }),
    ).resolves.toBe('User mira created');

    expect(hashMock).toHaveBeenCalledWith('secret1', 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: 'mira',
        passwordHash: 'hashed-password',
      },
    });
  });
});
