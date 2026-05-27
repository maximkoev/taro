import { Inject, Injectable } from '@nestjs/common';
import { UserDTO } from './schema/user.schema';
import type { Prisma } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async create(user: UserDTO) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const data = this.mapUser(user, passwordHash);
    return this.prisma.user
      .create({ data })
      .then((u) => this.successMsg(u.username));
  }

  private successMsg(name: string) {
    return `User ${name} created`;
  }

  private mapUser(user: UserDTO, passwordHash: string): Prisma.UserCreateInput {
    return { username: user.name, passwordHash };
  }
}
