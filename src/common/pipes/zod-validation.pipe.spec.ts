/* eslint-disable */
import * as z from 'zod';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  it('returns the parsed value when schema parsing succeeds', () => {
    const schema = z.object({ name: z.string(), age: z.number().optional() });
    const pipe = new ZodValidationPipe(schema);

    const input = { name: 'Alice', age: 30 };
    const out = pipe.transform(input, {} as any);

    expect(out).toEqual(input);
  });

  it('throws BadRequestException with mapped errors when zod validation fails', () => {
    const schema = z.object({ name: z.string() });
    const pipe = new ZodValidationPipe(schema);

    try {
      pipe.transform({ name: 123 }, {} as any);
      throw new Error('expected validation to fail');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      const resp: any = (err as BadRequestException).getResponse();
      expect(resp).toEqual(
        expect.objectContaining({
          message: 'Validation failed',
          errors: expect.any(Array),
        }),
      );

      expect(resp.errors.length).toBeGreaterThan(0);
      expect(resp.errors[0]).toEqual(
        expect.objectContaining({
          path: expect.any(String),
          message: expect.any(String),
        }),
      );
    }
  });

  it('throws InternalServerErrorException when parse throws a non-Zod error', () => {
    const badSchema = {
      parse: () => {
        throw new Error('boom');
      },
    } as unknown as z.ZodSchema;

    const pipe = new ZodValidationPipe(badSchema);

    try {
      pipe.transform({}, {} as any);
      throw new Error('expected internal error');
    } catch (err) {
      expect(err).toBeInstanceOf(InternalServerErrorException);
      // message should match the one used in the pipe
      expect((err as InternalServerErrorException).message).toBe(
        'Unexpected validation error',
      );
    }
  });
});
