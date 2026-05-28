import { HttpStatus } from '@nestjs/common';
import { buildError } from './error.type';

describe('buildError', () => {
  it('builds a public API error payload', () => {
    const error = buildError('Invalid payload', HttpStatus.BAD_REQUEST);

    expect(error).toEqual({
      message: 'Invalid payload',
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
    });
    expect(Number.isNaN(Date.parse(error.timestamp))).toBe(false);
  });
});
