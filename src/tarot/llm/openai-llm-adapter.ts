import { Injectable } from '@nestjs/common';
import { LlmPort } from './llm.port';
import { Card } from '../../domain/card';
import { Style } from '../schema/tarot.schema';
import OpenAI from 'openai';
import { TAROT_READER_PROMPT } from './prompts/tarot.prompt';

@Injectable()
export class OpenAILlmAdapter extends LlmPort {
  private client = new OpenAI();
  async getPrediction(
    question: string,
    style: Style,
    cards: Card[],
  ): Promise<string> {
    const prompt = this.promptFormatter(question, style, cards);
    const response = await this.client.responses.create({
      model: 'gpt-5.4-nano',
      instructions: TAROT_READER_PROMPT,
      input: prompt,
    });
    return response.output_text;
  }
  promptFormatter(question: string, style: Style, cards: Card[]): string {
    const cardsList = cards
      .map((card, index) => `${index + 1}. ${card.name}`)
      .join('\n');
    return `Question: ${question}, Style: ${style}, Cards in spread order: ${cardsList}.
    Respond in the same language as the question.`;
  }
}
