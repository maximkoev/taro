import 'reflect-metadata';

jest.mock('./prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

describe('PrismaModule', () => {
  it('provides and exports PrismaService', () => {
    const providers = Reflect.getMetadata('providers', PrismaModule);
    const exportsMetadata = Reflect.getMetadata('exports', PrismaModule);

    expect(providers).toEqual(expect.arrayContaining([PrismaService]));
    expect(exportsMetadata).toEqual(expect.arrayContaining([PrismaService]));
  });
});
