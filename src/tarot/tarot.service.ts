import { Inject, Injectable } from '@nestjs/common';
import { Deck } from '../domain/cards';
import { LlmPort } from './llm/llm.port';
import {
  PredictionTarotDTO,
  QuestionTarotDTO,
  Style,
} from './schema/tarot.schema';
import { Card } from '../domain/card';

@Injectable()
export class TarotService {
  constructor(@Inject(LlmPort) private readonly llm: LlmPort) {}

  tarot(req: QuestionTarotDTO): Promise<PredictionTarotDTO> {
    const cards = new Deck().draw(req.cards);
    return this.buildPrediction(req.question, req.style, cards);
  }

  async buildPrediction(
    question: QuestionTarotDTO['question'],
    style: Style,
    cards: Card[],
  ): Promise<PredictionTarotDTO> {
    const cs = cards.map((card) => card.name);
    const prediction = await this.llm.getPrediction(question, style, cards);
    return {
      question,
      cards: cs,
      prediction,
    };
  }
}
