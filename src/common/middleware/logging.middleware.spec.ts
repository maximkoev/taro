import { Logger } from '@nestjs/common';
import { LoggerMiddleware } from './logging.middleware';
import { Request, Response } from 'express';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let req: Partial<Request> & { requestId?: string };
  let res: Partial<Response> & {
    once: jest.Mock;
    statusCode: number;
    writableEnded: boolean;
  };
  let next: jest.Mock;
  let finishHandler: (() => void) | undefined;
  let closeHandler: (() => void) | undefined;
  let logSpy: jest.SpiedFunction<Logger['log']>;
  let warnSpy: jest.SpiedFunction<Logger['warn']>;

  beforeEach(() => {
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    warnSpy = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => {});

    middleware = new LoggerMiddleware();
    req = {
      method: 'GET',
      originalUrl: '/test',
      header: jest.fn().mockReturnValue(undefined),
    } as any;

    res = {
      statusCode: 200,
      writableEnded: true,
      once: jest.fn((event: string, handler: () => void) => {
        if (event === 'finish') {
          finishHandler = handler;
        }
        if (event === 'close') {
          closeHandler = handler;
        }
        return res as Response;
      }) as jest.Mock,
    } as any;

    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call next', () => {
    middleware.use(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should log a completed request with requestId from header when present', () => {
    (req.header as jest.Mock).mockReturnValue('header-id');

    middleware.use(req as Request, res as Response, next);
    finishHandler?.();

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy.mock.calls[0][0]).toEqual(
      expect.stringMatching(
        /^GET \/test 200 \d+ms requestId=header-id$/,
      ),
    );
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should log with requestId from req when set', () => {
    req.requestId = 'internal-id';

    middleware.use(req as Request, res as Response, next);
    finishHandler?.();

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy.mock.calls[0][0]).toContain('requestId=internal-id');
  });

  it("should log with 'unknown' requestId when none provided", () => {
    (req.header as jest.Mock).mockReturnValue(undefined);

    middleware.use(req as Request, res as Response, next);
    finishHandler?.();

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy.mock.calls[0][0]).toContain('requestId=unknown');
  });

  it('should warn when the connection closes before the response completes', () => {
    res.writableEnded = false;

    middleware.use(req as Request, res as Response, next);
    closeHandler?.();

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toEqual(
      expect.stringMatching(
        /^GET \/test 200 \d+ms requestId=unknown connection_closed$/,
      ),
    );
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('should not log twice when finish and close both fire', () => {
    middleware.use(req as Request, res as Response, next);
    finishHandler?.();
    closeHandler?.();

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
