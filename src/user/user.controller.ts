import {
  UserService,
  type UserService as UserServiceDependency,
} from './user.service';
import { Controller, Inject, Post } from '@nestjs/common';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { UserSchema } from './schema/user.schema';
import type { UserDTO } from './schema/user.schema';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService) private userService: UserServiceDependency,
  ) {}

  @Post()
  createUser(@ZodBody(UserSchema) user: UserDTO) {
    return this.userService.create(user);
  }
}
