import { LoggerMiddleware } from './logging.middleware';
import { Request, Response } from 'express';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let req: Partial<Request> & { requestId?: string };
  let res: Partial<Response> & { on: jest.Mock; statusCode: number };
  let next: jest.Mock;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
    req = {
      method: 'GET',
      originalUrl: '/test',
      header: jest.fn().mockReturnValue(undefined),
    } as any;

    res = {
      statusCode: 200,
      on: jest.fn((event: string, handler: () => void) => {
        if (event === 'finish') {
          handler();
        }
        return res as any;
      }),
    } as any;

    next = jest.fn();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.log as jest.Mock).mockRestore();
    jest.clearAllMocks();
  });

  it('should call next', () => {
    middleware.use(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should log with generated requestId from header when present', () => {
    (req.header as jest.Mock).mockReturnValue('header-id');

    middleware.use(req as Request, res as Response, next);

    expect(console.log).toHaveBeenCalledTimes(1);
    const logArg = (console.log as jest.Mock).mock.calls[0][0];
    expect(logArg.requestId).toBe('header-id');
    expect(logArg.method).toBe('GET');
    expect(logArg.url).toBe('/test');
    expect(logArg.statusCode).toBe(200);
    expect(typeof logArg.durationMS).toBe('number');
  });

  it('should log with requestId from req when set', () => {
    req.requestId = 'internal-id';

    middleware.use(req as Request, res as Response, next);

    expect(console.log).toHaveBeenCalledTimes(1);
    const logArg = (console.log as jest.Mock).mock.calls[0][0];
    expect(logArg.requestId).toBe('internal-id');
  });

  it("should log with 'unknown' requestId when none provided", () => {
    (req.header as jest.Mock).mockReturnValue(undefined);

    middleware.use(req as Request, res as Response, next);

    expect(console.log).toHaveBeenCalledTimes(1);
    const logArg = (console.log as jest.Mock).mock.calls[0][0];
    expect(logArg.requestId).toBe('unknown');
  });
});
