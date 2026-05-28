import { UserService } from './user.service';
import { Controller, Post } from '@nestjs/common';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import { UserDTO, UserSchema } from './schema/user.schema';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  createUser(@ZodBody(UserSchema) user: UserDTO) {
    return this.userService.create(user);
  }
}
