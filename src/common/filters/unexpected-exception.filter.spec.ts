import { HttpAdapterHost } from '@nestjs/core';
import { HttpStatus, HttpException } from '@nestjs/common';
import { UnexpectedErrorsFilter } from './unexpected-exception.filter';

describe('UnexpectedErrorsFilter', () => {
  it('should reply with the http exception response when HttpException is thrown', () => {
    const reply = jest.fn();
    const httpAdapterHost = {
      httpAdapter: { reply },
    } as unknown as HttpAdapterHost;
    const filter = new UnexpectedErrorsFilter(httpAdapterHost);

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
    } as unknown as HttpAdapterHost;
    const filter = new UnexpectedErrorsFilter(httpAdapterHost);

    const exception = new Error('boom');
    const ctx: any = {
      switchToHttp: () => ({
        getRequest: () => ({ requestId: 'abc-123' }),
        getResponse: () => ({ r: true }),
      }),
    };

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
  });
});
