import { HttpStatus, Logger } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma-exception.filter';

describe('PrismaClientExceptionFilter', () => {
  const createHost = (request: Record<string, unknown>, response = {}) =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    }) as any;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('replies with the mapped public error for known Prisma codes', () => {
    const reply = jest.fn();
    const filter = new PrismaClientExceptionFilter({
      httpAdapter: { reply },
    } as any);
    const response = { res: true };
    const exception = {
      code: 'P2002',
      message: 'Unique constraint failed on username',
      stack: 'stacktrace',
    };
    const host = createHost(
      { requestId: 'req-1', method: 'POST', url: '/user' },
      response,
    );
    const loggerSpy = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);

    filter.catch(exception as any, host);

    expect(reply).toHaveBeenCalledWith(
      response,
      expect.objectContaining({
        message: 'Unique constraint violation',
        statusCode: HttpStatus.CONFLICT,
        timestamp: expect.any(String),
      }),
      HttpStatus.CONFLICT,
    );
    expect(loggerSpy).toHaveBeenCalledWith(
      {
        requestId: 'req-1',
        prismaCode: 'P2002',
        message: 'Unique constraint failed on username',
        method: 'POST',
        url: '/user',
      },
      'stacktrace',
    );
  });

  it('rethrows unmapped Prisma errors', () => {
    const reply = jest.fn();
    const filter = new PrismaClientExceptionFilter({
      httpAdapter: { reply },
    } as any);
    const exception = { code: 'P2025', message: 'Record not found' };
    const host = createHost({ requestId: 'req-2' });

    let thrown: unknown;
    try {
      filter.catch(exception as any, host);
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBe(exception);
    expect(reply).not.toHaveBeenCalled();
  });
});
