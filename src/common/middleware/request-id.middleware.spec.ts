import { RequestIdMiddleware } from './request-id.middleware';
import { Request, Response } from 'express';

describe('RequestIdMiddleware', () => {
  let middleware: RequestIdMiddleware;
  let req: Partial<Request> & { requestId?: string };
  let res: Partial<Response> & { setHeader: jest.Mock };
  let next: jest.Mock;

  beforeEach(() => {
    middleware = new RequestIdMiddleware();
    req = {
      header: jest.fn().mockReturnValue(undefined),
    } as Partial<Request> & { requestId?: string };

    res = {
      setHeader: jest.fn(),
    } as Partial<Response> & { setHeader: jest.Mock };

    next = jest.fn();
  });

  it('should call next', () => {
    middleware.use(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should reuse existing x-request-id header', () => {
    (req.header as jest.Mock).mockReturnValue('existing-id');

    middleware.use(req as Request, res as Response, next);

    expect(res.setHeader).toHaveBeenCalledWith('x-request-id', 'existing-id');
    expect((req as any).requestId).toBe('existing-id');
  });

  it('should generate new x-request-id when header is missing', () => {
    // header is mocked to return undefined in beforeEach
    middleware.use(req as Request, res as Response, next);

    expect(res.setHeader).toHaveBeenCalledTimes(1);
    const [headerName, generatedId] = (res.setHeader as jest.Mock).mock
      .calls[0];

    expect(headerName).toBe('x-request-id');
    expect(typeof generatedId).toBe('string');
    expect(generatedId.length).toBeGreaterThan(0);
    expect((req as any).requestId).toBe(generatedId);
  });
});
