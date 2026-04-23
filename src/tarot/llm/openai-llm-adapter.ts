import { Injectable } from '@nestjs/common';
import { LlmPort } from './llm.port';
import { Card } from '../../domain/card';
import { Style } from '../schema/tarot.schema';

@Injectable()
export class OpenAILlmAdapter extends LlmPort {
  async getPrediction(
    question: string,
    style: Style,
    cards: Card[],
  ): Promise<string> {
    const cs = cards.map((c) => c.name).join(', ');
    return Promise.resolve(
      `Open-AI. Answer: ${question}, cards: ${cs}, style: ${style}`,
    );
  }
}
