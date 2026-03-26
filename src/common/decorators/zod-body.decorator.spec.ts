/* eslint-disable */
import * as z from 'zod';

const mockBody = jest.fn().mockReturnValue('MOCK_BODY_DECORATOR');

jest.mock('@nestjs/common', () => ({ Body: mockBody }));

describe('ZodBody decorator', () => {
  beforeEach(() => {
    jest.resetModules();
    mockBody.mockClear();
  });

  it('calls Body with a ZodValidationPipe instance and returns Body result', () => {
    const { ZodBody } = require('./zod-body.decorator');
    const { ZodValidationPipe } = require('../pipes/zod-validation.pipe');

    const schema = z.object({ name: z.string() });

    const result = ZodBody(schema);

    expect(mockBody).toHaveBeenCalledTimes(1);
    expect(result).toBe('MOCK_BODY_DECORATOR');

    const passedPipe = mockBody.mock.calls[0][0];
    expect(passedPipe).toBeInstanceOf(ZodValidationPipe);

    const valid = { name: 'ok' };
    expect(passedPipe.transform(valid, {})).toEqual(valid);

    const invalid = { name: 123 };
    expect(() => passedPipe.transform(invalid, {})).toThrow();
  });
});
