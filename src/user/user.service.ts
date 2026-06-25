import { Inject, Injectable } from '@nestjs/common';
import { UserDTO } from './schema/user.schema';
import type { Prisma } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import {
  PrismaService,
  type PrismaService as PrismaServiceDependency,
} from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaServiceDependency,
  ) {}

  async create(user: UserDTO) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const data = this.toUserCreateInput(user, passwordHash);
    return this.prisma.user.create({ data }).then((u) => this.successMsg(u));
  }

  private successMsg(name: { firstName: string; lastName: string | null }) {
    const n = [name.firstName, name.lastName].filter(Boolean).join(' ');
    return { message: `User ${n} created` };
  }

  private toUserCreateInput(
    user: UserDTO,
    passwordHash: string,
  ): Prisma.UserCreateInput {
    const { email, firstName, lastName } = user;
    return {
      email,
      firstName,
      lastName,
      passwordHash,
    };
  }
}
