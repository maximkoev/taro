import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  AuthService,
  type AuthService as AuthServiceDependency,
} from './auth.service';
import type { LoginResponseDTO } from './schema/login.schema';
import { LocalAuthGuard } from './local-auth.guard';
import type { User } from '../../generated/prisma/client';
import { Public } from '../common/decorators/public-api.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthServiceDependency,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  login(@Req() req: Request & { user: User }): LoginResponseDTO {
    if ('user' in req && req.user) return this.authService.login(req.user);
    throw new BadRequestException('Invalid request body');
  }
}
