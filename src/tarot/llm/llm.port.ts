import { Card } from '../../domain/card';
import { Style } from '../schema/tarot.schema';

export abstract class LlmPort {
  abstract getPrediction(
    question: string,
    style: Style,
    cards: Card[],
  ): Promise<string>;
}
