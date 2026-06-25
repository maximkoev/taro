import * as z from 'zod';
import { UserSchema } from './user.schema';

describe('UserSchema', () => {
  it('parses valid user registration payloads', () => {
    const payload = {
      firstName: 'Mira',
      lastName: 'Stone',
      email: 'mira@example.com',
      password: 'secret1',
    };

    expect(UserSchema.parse(payload)).toEqual(payload);
  });

  it('rejects invalid names, email, and passwords', () => {
    expect(() =>
      UserSchema.parse({
        firstName: 'a',
        email: 'mira@example.com',
        password: 'secret1',
      }),
    ).toThrow(z.ZodError);
    expect(() =>
      UserSchema.parse({
        firstName: 'Mira',
        email: 'not-an-email',
        password: 'secret1',
      }),
    ).toThrow(z.ZodError);
    expect(() =>
      UserSchema.parse({
        firstName: 'Mira',
        email: 'mira@example.com',
        password: 'short',
      }),
    ).toThrow(z.ZodError);
    expect(() =>
      UserSchema.parse({
        firstName: 'a'.repeat(101),
        email: 'mira@example.com',
        password: 'secret1',
      }),
    ).toThrow(z.ZodError);
  });
});
