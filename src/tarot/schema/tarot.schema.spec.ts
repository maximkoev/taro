import * as z from 'zod';
import { QuestionTaroSchema, PredictionTarotSchema } from './tarot.schema';

describe('tarot schemas', () => {
  describe('QuestionTaroSchema', () => {
    it('parses valid payloads', () => {
      const valid = { question: 'Is this ok?', cards: 3, style: 'soft' };
      const parsed = QuestionTaroSchema.parse(valid);
      expect(parsed).toEqual(valid);
    });

    it('rejects missing question or invalid fields', () => {
      expect(() =>
        QuestionTaroSchema.parse({ cards: 3, style: 'soft' }),
      ).toThrow(z.ZodError);
      expect(() =>
        QuestionTaroSchema.parse({ question: '', cards: 3, style: 'soft' }),
      ).toThrow(z.ZodError);
      expect(() =>
        QuestionTaroSchema.parse({ question: 'x', cards: 5, style: 'soft' }),
      ).toThrow(z.ZodError);
      expect(() =>
        QuestionTaroSchema.parse({ question: 'x', cards: 3, style: 'weird' }),
      ).toThrow(z.ZodError);
    });
  });

  describe('PredictionTarotSchema', () => {
    it('parses valid predictions', () => {
      const valid = {
        question: 'Q',
        cards: ['A', 'B'],
        prediction: 'Look ahead',
      };
      const parsed = PredictionTarotSchema.parse(valid);
      expect(parsed).toEqual(valid);
    });

    it('rejects invalid shapes', () => {
      expect(() =>
        PredictionTarotSchema.parse({
          question: 'Q',
          cards: 'not-array',
          prediction: 'p',
        }),
      ).toThrow(z.ZodError);
      expect(() =>
        PredictionTarotSchema.parse({ question: 'Q', cards: ['A'] }),
      ).toThrow(z.ZodError);
    });
  });
});
