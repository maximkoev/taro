import * as z from 'zod';

const cardsValidNumbers = [3, 6];

export const QuestionTaroSchema = z
  .object({
    question: z.string().min(1, 'Question is required'),
    cards: z
      .number()
      .int()
      .refine(
        (n) => cardsValidNumbers.includes(n),
        `Cards must be one of the following values: ${cardsValidNumbers.join(',')}`,
      ),
    style: z.enum(['soft', 'hard'], "Style must be either 'soft' or 'hard'"),
  })
  .required();

export const PredictionTarotSchema = z
  .object({
    question: z.string(),
    cards: z.array(z.string()),
    prediction: z.string(),
  })
  .required();

export type QuestionTarotDTO = z.infer<typeof QuestionTaroSchema>;

export type PredictionTarotDTO = z.infer<typeof PredictionTarotSchema>;
