import { deck } from './deck';
import { isNonNegativeInteger } from '../common/utils/type-guards.util';
import { Card } from './card';

export class Deck {
  private get deck(): Card[] {
    return [...deck];
  }
  private shuffle(): Card[] {
    const deck = this.deck;
    const lastIndex = deck.length - 1;
    for (let i = lastIndex; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  draw(n: number): Card[] {
    this.assertIsNonNegativeInteger(n);
    return this.shuffle().slice(0, n);
  }

  private assertIsNonNegativeInteger(value: unknown): asserts value is number {
    if (!isNonNegativeInteger(value))
      throw new RangeError(
        `Expected a non-negative integer, got ${JSON.stringify(value)}`,
      );
  }
}
