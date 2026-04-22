/* eslint-disable */
import { Deck } from './cards';
import { deck as originalDeck } from './deck';

describe('Deck', () => {
  const ORIGINAL_DECK_COPY = [...originalDeck];
  let mathRandomSpy: jest.SpyInstance<number, []>;

  afterEach(() => {
    if (mathRandomSpy) {
      mathRandomSpy.mockRestore();
    }
  });

  it('draws the requested number of cards (basic)', () => {
    const d = new Deck();
    const res = d.draw(3);
    expect(Array.isArray(res)).toBe(true);
    expect(res).toHaveLength(3);
    // drawn cards should be strings present in original deck
    res.forEach((c) => expect(originalDeck).toContain(c));
  });

  it('returns empty array when drawing 0 cards', () => {
    const d = new Deck();
    const res = d.draw(0);
    expect(res).toEqual([]);
  });

  it('when requested more than deck length returns entire deck (shuffled)', () => {
    const d = new Deck();
    const res = d.draw(originalDeck.length + 10);
    expect(res).toHaveLength(originalDeck.length);
    // Should contain same elements as original (order may differ).
    expect([...res].sort((a, b) => a.id.localeCompare(b.id))).toEqual(
      [...ORIGINAL_DECK_COPY].sort((a, b) => a.id.localeCompare(b.id)),
    );
  });

  it('throws RangeError for non-integer input (e.g., 2.7)', () => {
    const d = new Deck();
    expect(() => d.draw(2.7 as any)).toThrow(RangeError);
  });

  it('throws RangeError for negative n (e.g., -1)', () => {
    const d = new Deck();
    expect(() => d.draw(-1 as any)).toThrow(RangeError);
  });

  it('shuffles deterministically when Math.random is mocked (all zeros)', () => {
    mathRandomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);

    const smallDeck = [
      { locale_id: 'a', name: 'A' },
      { locale_id: 'b', name: 'B' },
      { locale_id: 'c', name: 'C' },
      { locale_id: 'd', name: 'D' },
    ];
    const desc = Object.getOwnPropertyDescriptor(
      Deck.prototype,
      'deck',
    ) as PropertyDescriptor;
    Object.defineProperty(Deck.prototype, 'deck', {
      get: function () {
        return [...smallDeck];
      },
      configurable: true,
    });

    try {
      const d = new Deck();
      const res = d.draw(4);
      const expected = [
        { locale_id: 'b', name: 'B' },
        { locale_id: 'c', name: 'C' },
        { locale_id: 'd', name: 'D' },
        { locale_id: 'a', name: 'A' },
      ];
      expect(res).toEqual(expected);
    } finally {
      Object.defineProperty(Deck.prototype, 'deck', desc);
    }
  });

  it('does not mutate the original deck constant', () => {
    const before = [...originalDeck];
    const d = new Deck();
    d.draw(5);
    expect(originalDeck).toEqual(before);
  });

  // Negative / edge-case tests for current draw behavior (Deck.draw validation may throw)
  it('throws RangeError for NaN input', () => {
    const d = new Deck();
    expect(() => d.draw(NaN as any)).toThrow(RangeError);
  });

  it('throws RangeError for numeric string input ("3")', () => {
    const d = new Deck();
    expect(() => d.draw('3' as any)).toThrow(RangeError);
  });

  it('throws RangeError for undefined input', () => {
    const d = new Deck();
    expect(() => d.draw(undefined as any)).toThrow(RangeError);
  });

  it('throws RangeError for null input', () => {
    const d = new Deck();
    expect(() => d.draw(null as any)).toThrow(RangeError);
  });

  it('throws RangeError for object input (coerces to [object Object])', () => {
    const d = new Deck();
    expect(() => d.draw({} as any)).toThrow(RangeError);
  });

  it('throws RangeError for very large negative n', () => {
    const d = new Deck();
    expect(() => d.draw(-1000 as any)).toThrow(RangeError);
  });
});
