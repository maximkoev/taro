import { Prisma } from '../../../generated/prisma/client';
import { HttpStatus } from '@nestjs/common';
import { PrismaErrorConfig } from './error.type';

export const PRISMA_ERROR_MAP: Partial<
  Record<Prisma.PrismaClientKnownRequestError['code'], PrismaErrorConfig>
> = {
  P2002: {
    status: HttpStatus.CONFLICT,
    publicMessage: 'Unique constraint violation',
    logLevel: 'warn',
  },
};
