import { HttpStatus } from '@nestjs/common';
import { PRISMA_ERROR_MAP } from './prisma-error.map';

describe('PRISMA_ERROR_MAP', () => {
  it('maps unique constraint errors to conflict responses', () => {
    expect(PRISMA_ERROR_MAP.P2002).toEqual({
      status: HttpStatus.CONFLICT,
      publicMessage: 'Unique constraint violation',
      logLevel: 'warn',
    });
  });
});
