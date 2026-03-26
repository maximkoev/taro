import { isNonNegativeInteger, isNonEmptyString } from './type-guards.util';

describe('type-guards.util', () => {
  describe('isNonNegativeInteger', () => {
    it('returns true for valid non-negative integers', () => {
      expect(isNonNegativeInteger(0)).toBe(true);
      expect(isNonNegativeInteger(1)).toBe(true);
      expect(isNonNegativeInteger(42)).toBe(true);
      expect(isNonNegativeInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
    });

    it('returns false for negative integers', () => {
      expect(isNonNegativeInteger(-1)).toBe(false);
      expect(isNonNegativeInteger(-100)).toBe(false);
    });

    it('returns false for non-integer numbers', () => {
      expect(isNonNegativeInteger(1.5)).toBe(false);
      expect(isNonNegativeInteger(Math.PI)).toBe(false);
    });

    it('returns false for NaN and Infinity', () => {
      expect(isNonNegativeInteger(NaN)).toBe(false);
      expect(isNonNegativeInteger(Infinity)).toBe(false);
      expect(isNonNegativeInteger(-Infinity)).toBe(false);
    });

    it('returns false for non-number types', () => {
      expect(isNonNegativeInteger('3' as any)).toBe(false);
      expect(isNonNegativeInteger(null as any)).toBe(false);
      expect(isNonNegativeInteger(undefined as any)).toBe(false);
      expect(isNonNegativeInteger({} as any)).toBe(false);
      expect(isNonNegativeInteger([] as any)).toBe(false);
      expect(isNonNegativeInteger(true as any)).toBe(false);
    });

    it('can be used as a type guard in runtime control flow', () => {
      const maybe = (v: any) => (isNonNegativeInteger(v) ? v + 1 : null);
      expect(maybe(2)).toBe(3);
      expect(maybe(-1)).toBeNull();
      expect(maybe('5')).toBeNull();
    });
  });

  describe('isNonEmptyString', () => {
    it('returns true for non-empty strings', () => {
      expect(isNonEmptyString('a')).toBe(true);
      expect(isNonEmptyString('hello')).toBe(true);
      expect(isNonEmptyString('  hi  ')).toBe(true);
      expect(isNonEmptyString('0')).toBe(true);
    });

    it('returns false for empty or whitespace-only strings', () => {
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString('   ')).toBe(false);
      expect(isNonEmptyString('\n\t')).toBe(false);
    });

    it('returns false for non-string types', () => {
      expect(isNonEmptyString(0 as any)).toBe(false);
      expect(isNonEmptyString(null as any)).toBe(false);
      expect(isNonEmptyString(undefined as any)).toBe(false);
      expect(isNonEmptyString({} as any)).toBe(false);
      expect(isNonEmptyString([] as any)).toBe(false);
      expect(isNonEmptyString(true as any)).toBe(false);
    });

    it('example usage as a runtime guard', () => {
      function greet(x: unknown) {
        if (isNonEmptyString(x)) return `hi ${x.trim()}`;
        return 'no name';
      }
      expect(greet(' Alice ')).toBe('hi Alice');
      expect(greet('')).toBe('no name');
      expect(greet(null)).toBe('no name');
    });
  });
});
