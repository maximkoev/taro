import { LlmPort } from './llm.port';
import { Injectable } from '@nestjs/common';
import { Card } from '../../domain/card';
import { Style } from '../schema/tarot.schema';

@Injectable()
export class FakeLLMAdapter extends LlmPort {
  async getPrediction(
    question: string,
    style: Style,
    cards: Card[],
  ): Promise<string> {
    const cs = cards.map((c) => c.name).join(', ');
    return Promise.resolve(
      `Fake. Answer: ${question}, cards: ${cs}, style: ${style}`,
    );
  }
}
