import { PassportStrategy } from '@nestjs/passport';
import {
  AuthService,
  type AuthService as AuthServiceDependency,
} from './auth.service';
import { Strategy } from 'passport-local';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../generated/prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthServiceDependency,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
