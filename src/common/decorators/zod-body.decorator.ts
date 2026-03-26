import * as z from 'zod';
import { Body } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

export function ZodBody(schema: z.ZodObject): ParameterDecorator {
  return Body(new ZodValidationPipe(schema));
}
