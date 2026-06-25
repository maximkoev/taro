import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginResponseDTO } from './schema/login.schema';
import {
  PrismaService,
  type PrismaService as PrismaServiceDependency,
} from '../prisma/prisma.service';
import type { User } from '../../generated/prisma/client';
import {
  JwtService,
  type JwtService as JwtServiceDependency,
} from '@nestjs/jwt';
import { JwtPayload } from './types/jwt.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaServiceDependency,
    @Inject(JwtService) private readonly jwtService: JwtServiceDependency,
  ) {}
  login(user: User): LoginResponseDTO {
    return this.buildResponse(user);
  }

  private buildResponse(user: User): LoginResponseDTO {
    const payload = this.getPayload(user);
    const token = this.jwtService.sign(payload);
    return {
      token,
      user: this.getPublicUser(user),
    };
  }

  private getPayload(user: { email: string; id: string }): JwtPayload {
    return { email: user.email, sub: user.id };
  }

  private getPublicUser(user: User): LoginResponseDTO['user'] {
    const publicUser: LoginResponseDTO['user'] = {
      firstName: user.firstName,
      email: user.email,
      isTemporaryEmail: user.isTemporaryEmail,
    };
    if (user.lastName) publicUser.lastName = user.lastName;
    return publicUser;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) return null;
    if (!(await this.isPwdValid(password, user.passwordHash))) {
      return null;
    }
    return user;
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  private async isPwdValid(pwd: string, hash: string): Promise<boolean> {
    return bcrypt.compare(pwd, hash);
  }
}
