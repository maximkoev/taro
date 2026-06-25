import type { ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../common/decorators/public-api.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let reflector: { getAllAndOverride: jest.Mock };
  let guard: JwtAuthGuard;

  class TestController {}
  const handler = jest.fn();
  const context = {
    getHandler: () => handler,
    getClass: () => TestController,
  } as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    };
    guard = new JwtAuthGuard(reflector as unknown as Reflector);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('allows public routes without delegating to passport', () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    const baseCanActivate = jest
      .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
      .mockReturnValue(false);

    expect(guard.canActivate(context)).toBe(true);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      handler,
      TestController,
    ]);
    expect(baseCanActivate).not.toHaveBeenCalled();
  });

  it('delegates protected routes to passport jwt auth', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const baseCanActivate = jest
      .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
      .mockReturnValue('passport-result' as any);

    expect(guard.canActivate(context)).toBe('passport-result');

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      handler,
      TestController,
    ]);
    expect(baseCanActivate).toHaveBeenCalledWith(context);
  });
});
