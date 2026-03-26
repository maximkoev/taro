import {
  BadRequestException,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common';
import * as z from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodSchema) {}

  transform(value: unknown): unknown {
    let validated: unknown;
    try {
      validated = this.schema.parse(value);
      return validated;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errors = e.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        throw new BadRequestException({ message: 'Validation failed', errors });
      }
      throw new InternalServerErrorException('Unexpected validation error', {
        cause: e,
      });
    }
  }
}
