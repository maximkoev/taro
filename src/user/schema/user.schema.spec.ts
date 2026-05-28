import * as z from 'zod';
import { UserSchema } from './user.schema';

describe('UserSchema', () => {
  it('parses valid user registration payloads', () => {
    const payload = { name: 'mira', password: 'secret1' };

    expect(UserSchema.parse(payload)).toEqual(payload);
  });

  it('rejects invalid names and passwords', () => {
    expect(() =>
      UserSchema.parse({ name: 'a', password: 'secret1' }),
    ).toThrow(z.ZodError);
    expect(() =>
      UserSchema.parse({ name: 'mira', password: 'short' }),
    ).toThrow(z.ZodError);
    expect(() =>
      UserSchema.parse({ name: 'a'.repeat(101), password: 'secret1' }),
    ).toThrow(z.ZodError);
  });
});
