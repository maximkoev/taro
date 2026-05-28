import { Logger } from '@nestjs/common';

const mockAdapterInstance = { adapter: 'pg' };
const mockConnect = jest.fn();
const mockDisconnect = jest.fn();
const mockPrismaClientConstructor = jest.fn();

jest.mock('../../env.helper', () => ({
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/taro',
}));

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn().mockReturnValue(mockAdapterInstance),
}));

jest.mock('../../generated/prisma/client', () => ({
  PrismaClient: class {
    constructor(options: unknown) {
      mockPrismaClientConstructor(options);
    }

    $connect = mockConnect;
    $disconnect = mockDisconnect;
  },
}));

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    mockConnect.mockReset();
    mockDisconnect.mockReset();
    mockPrismaClientConstructor.mockClear();
    loggerSpy = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  it('configures PrismaClient with the postgres adapter and logging', () => {
    new PrismaService();

    expect(PrismaPg).toHaveBeenCalledWith({
      connectionString: 'postgresql://user:pass@localhost:5432/taro',
    });
    expect(mockPrismaClientConstructor).toHaveBeenCalledWith({
      adapter: mockAdapterInstance,
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
    });
    expect(loggerSpy).toHaveBeenCalledWith('PrismaService initialized');
  });

  it('connects when the Nest module initializes', async () => {
    const service = new PrismaService();
    mockConnect.mockResolvedValue('connected');

    await expect(service.onModuleInit()).resolves.toBe('connected');

    expect(loggerSpy).toHaveBeenCalledWith('Connect to db');
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  it('disconnects when the Nest module is destroyed', async () => {
    const service = new PrismaService();
    mockDisconnect.mockResolvedValue('disconnected');

    await expect(service.onModuleDestroy()).resolves.toBe('disconnected');

    expect(loggerSpy).toHaveBeenCalledWith(
      'PrismaService is being destroyed, disconnecting from database',
    );
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
