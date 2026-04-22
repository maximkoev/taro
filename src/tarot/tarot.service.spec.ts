import { TarotService } from './tarot.service';
import { Deck } from '../domain/cards';
import { Card } from '../domain/card';
import { LlmPort } from './llm/llm.port';

describe('TarotService', () => {
  let service: TarotService;
  let llm: jest.Mocked<LlmPort>;

  beforeEach(() => {
    llm = {
      getPrediction: jest.fn(),
    } as jest.Mocked<LlmPort>;
    service = new TarotService(llm);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('draws the requested number of cards and returns a prediction (soft)', async () => {
    const cards: Card[] = [
      { id: 'a', name: 'Card A' },
      { id: 'b', name: 'Card B' },
      { id: 'c', name: 'Card C' },
    ];
    const drawSpy = jest.spyOn(Deck.prototype, 'draw').mockReturnValue(cards);
    llm.getPrediction.mockResolvedValue('A positive sign.');

    const q = { question: 'Will I be okay?', cards: 3, style: 'soft' } as any;
    const res = await service.tarot(q);

    expect(drawSpy).toHaveBeenCalledWith(3);
    expect(llm.getPrediction).toHaveBeenCalledWith(q.question, q.style, cards);
    expect(res.question).toBe(q.question);
    expect(res.cards).toEqual(cards.map((card) => card.name));
    expect(res.prediction).toBe('A positive sign.');
  });

  it('produces a different tone when style is hard', async () => {
    const cards: Card[] = [
      { id: 'c1', name: 'Card 1' },
      { id: 'c2', name: 'Card 2' },
      { id: 'c3', name: 'Card 3' },
      { id: 'c4', name: 'Card 4' },
      { id: 'c5', name: 'Card 5' },
      { id: 'c6', name: 'Card 6' },
    ];
    jest.spyOn(Deck.prototype, 'draw').mockReturnValue(cards);
    llm.getPrediction.mockResolvedValue('Hard reading.');

    const q = { question: 'Tough path?', cards: 6, style: 'hard' } as any;
    const res = await service.tarot(q);

    expect(res.cards).toHaveLength(6);
    expect(res.cards).toEqual(cards.map((card) => card.name));
    expect(res.prediction).toBe('Hard reading.');
  });
});
