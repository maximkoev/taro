import type { ExecutionContext } from '@nestjs/common';
import * as z from 'zod';
import { LocalAuthGuard } from './local-auth.guard';

describe('LocalAuthGuard', () => {
  const createContext = (body: unknown): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ body }),
      }),
    }) as ExecutionContext;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('validates the login body before delegating to passport', () => {
    const context = createContext({
      email: 'mira@example.com',
      password: 'plain-password',
    });
    const baseCanActivate = jest
      .spyOn(Object.getPrototypeOf(LocalAuthGuard.prototype), 'canActivate')
      .mockReturnValue(true);

    const result = new LocalAuthGuard().canActivate(context);

    expect(result).toBe(true);
    expect(baseCanActivate).toHaveBeenCalledWith(context);
  });

  it('throws ZodError and does not delegate when the login body is invalid', () => {
    const context = createContext({
      email: 'not-an-email',
      password: 'plain-password',
    });
    const baseCanActivate = jest
      .spyOn(Object.getPrototypeOf(LocalAuthGuard.prototype), 'canActivate')
      .mockReturnValue(true);

    expect(() => new LocalAuthGuard().canActivate(context)).toThrow(z.ZodError);
    expect(baseCanActivate).not.toHaveBeenCalled();
  });
});
