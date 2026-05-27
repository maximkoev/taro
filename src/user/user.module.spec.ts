import 'reflect-metadata';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { PrismaModule } from '../prisma/prisma.module';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { UserService } from './user.service';

describe('UserModule', () => {
  it('wires the user controller, service, and Prisma module', () => {
    const imports = Reflect.getMetadata('imports', UserModule);
    const controllers = Reflect.getMetadata('controllers', UserModule);
    const providers = Reflect.getMetadata('providers', UserModule);

    expect(imports).toEqual(expect.arrayContaining([PrismaModule]));
    expect(controllers).toEqual(expect.arrayContaining([UserController]));
    expect(providers).toEqual(expect.arrayContaining([UserService]));
  });
});
