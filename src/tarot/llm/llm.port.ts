import { Card } from '../../domain/card';
import { Style, QuestionTarotDTO } from '../schema/tarot.schema';

export abstract class LlmPort {
  abstract getPrediction(
    question: QuestionTarotDTO['question'],
    style: Style,
    cards: Card[],
  ): Promise<string>;
}
