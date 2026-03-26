import { TarotService } from './tarot.service';
import { Deck } from '../domain/cards';

describe('TarotService', () => {
  let service: TarotService;

  beforeEach(() => {
    service = new TarotService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('draws the requested number of cards and returns a prediction (soft)', () => {
    const cards = ['A', 'B', 'C'];
    const drawSpy = jest.spyOn(Deck.prototype, 'draw').mockReturnValue(cards);

    const q = { question: 'Will I be okay?', cards: 3, style: 'soft' } as any;
    const res = service.tarot(q);

    expect(drawSpy).toHaveBeenCalledWith(3);
    expect(res.question).toBe(q.question);
    expect(res.cards).toEqual(cards);
    expect(typeof res.prediction).toBe('string');
    expect(res.prediction).toContain('positive');
  });

  it('produces a different tone when style is hard', () => {
    const cards = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
    jest.spyOn(Deck.prototype, 'draw').mockReturnValue(cards);

    const q = { question: 'Tough path?', cards: 6, style: 'hard' } as any;
    const res = service.tarot(q);

    expect(res.cards).toHaveLength(6);
    expect(res.prediction).toContain('there may be challenges');
  });
});
