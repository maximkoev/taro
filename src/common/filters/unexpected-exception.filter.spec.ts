import { HttpStatus, HttpException, Logger } from '@nestjs/common';
import { UnexpectedErrorsFilter } from './unexpected-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';

describe('UnexpectedErrorsFilter', () => {
  it('should reply with the http exception response when HttpException is thrown', () => {
    const reply = jest.fn();
    const httpAdapterHost = {
      httpAdapter: { reply },
    };
    const filter = new UnexpectedErrorsFilter(httpAdapterHost as any);

    const exception = new HttpException({ ok: false }, HttpStatus.BAD_REQUEST);
    const ctx: any = {
      switchToHttp: () => ({ getResponse: () => ({ prop: true }) }),
    };

    filter.catch(exception, ctx as any);

    expect(reply).toHaveBeenCalledWith(
      { prop: true },
      { ok: false },
      HttpStatus.BAD_REQUEST,
    );
  });

  it('should log and reply with 500 for unexpected errors', () => {
    const reply = jest.fn();
    const httpAdapterHost = {
      httpAdapter: { reply },
    };
    const filter = new UnexpectedErrorsFilter(
      httpAdapterHost as any as HttpAdapterHost,
    );

    const exception = new Error('boom');
    const ctx: any = {
      switchToHttp: () => ({
        getRequest: () => ({ requestId: 'abc-123' }),
        getResponse: () => ({ r: true }),
      }),
    };

    const loggerSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);

    filter.catch(exception, ctx as any);

    expect(reply).toHaveBeenCalledWith(
      { r: true },
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: expect.any(String),
      }),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    expect(loggerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'An unexpected error occurred',
        requestId: 'abc-123',
      }),
      expect.stringContaining('Error: boom'),
    );

    loggerSpy.mockRestore();
  });
});
