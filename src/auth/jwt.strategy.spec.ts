import type { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('reads the JWT secret from config and maps payloads to request users', () => {
    const configService = {
      getOrThrow: jest.fn().mockReturnValue('jwt-secret'),
    };

    const strategy = new JwtStrategy(configService as unknown as ConfigService);

    expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
    expect(
      strategy.validate({ sub: 'user-1', email: 'mira@example.com' }),
    ).toStrictEqual({
      userId: 'user-1',
      email: 'mira@example.com',
    });
  });
});
