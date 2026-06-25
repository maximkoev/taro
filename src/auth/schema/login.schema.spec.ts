import * as z from 'zod';
import { LoginResponseSchema, LoginSchema } from './login.schema';

describe('LoginSchema', () => {
  it('parses valid login payloads', () => {
    const payload = { email: 'mira@example.com', password: 'plain-password' };

    expect(LoginSchema.parse(payload)).toEqual(payload);
  });

  it('rejects invalid login payloads', () => {
    expect(() =>
      LoginSchema.parse({ email: 'not-an-email', password: 'plain-password' }),
    ).toThrow(z.ZodError);
    expect(() => LoginSchema.parse({ email: 'mira@example.com' })).toThrow(
      z.ZodError,
    );
  });
});

describe('LoginResponseSchema', () => {
  it('parses login responses with an optional last name', () => {
    const response = {
      token: 'jwt-token',
      user: {
        email: 'mira@example.com',
        firstName: 'Mira',
        lastName: 'Stone',
        isTemporaryEmail: false,
      },
    };

    expect(LoginResponseSchema.parse(response)).toEqual(response);
    expect(
      LoginResponseSchema.parse({
        ...response,
        user: { ...response.user, lastName: undefined },
      }),
    ).toEqual({
      ...response,
      user: { ...response.user, lastName: undefined },
    });
  });

  it('rejects malformed login responses', () => {
    expect(() =>
      LoginResponseSchema.parse({
        token: 'jwt-token',
        user: {
          email: 'not-an-email',
          firstName: 'Mira',
          isTemporaryEmail: false,
        },
      }),
    ).toThrow(z.ZodError);
  });
});
