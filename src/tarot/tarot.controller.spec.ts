/* eslint-disable */
import { TarotController } from './tarot.controller';
import { TarotService } from './tarot.service';

describe('TarotController', () => {
  let controller: TarotController;
  let service: Partial<TarotService>;

  beforeEach(() => {
    service = { tarot: jest.fn() };
    controller = new TarotController(service as TarotService);
  });

  it('forwards the body to the service and returns its result', () => {
    const body = { question: 'Will I win?', cards: 3, style: 'soft' };
    const prediction = {
      question: body.question,
      cards: ['Card A', 'Card B', 'Card C'],
      prediction: 'A positive outcome',
    };

    (service.tarot as jest.Mock).mockReturnValue(prediction);

    const result = controller.tarot(body as any);

    const tarotMock = service.tarot as jest.Mock;
    expect(tarotMock).toHaveBeenCalledTimes(1);
    expect(tarotMock).toHaveBeenCalledWith(body);
    expect(result).toBe(prediction);
  });

  it('propagates errors thrown by the service', () => {
    const body = { question: 'Will I fail?', cards: 3, style: 'soft' };
    const err = new Error('service failure');
    (service.tarot as jest.Mock).mockImplementation(() => {
      throw err;
    });

    expect(() => controller.tarot(body as any)).toThrow(err);
  });

  it('works with different card counts and styles', () => {
    const body = { question: 'Another Q', cards: 6, style: 'hard' };
    const prediction = {
      question: body.question,
      cards: Array.from({ length: 6 }).map((_, i) => `Card ${i}`),
      prediction: 'A detailed reading',
    };

    (service.tarot as jest.Mock).mockReturnValue(prediction);

    const result = controller.tarot(body as any);

    const tarotMock = service.tarot as jest.Mock;
    expect(tarotMock).toHaveBeenCalledTimes(1);
    expect(tarotMock).toHaveBeenCalledWith(body);
    expect(result).toEqual(prediction);
  });
});
