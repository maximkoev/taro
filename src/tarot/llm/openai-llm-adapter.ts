import { Injectable } from '@nestjs/common';
import { LlmPort } from './llm.port';
import { Card } from '../../domain/card';
import { Style } from '../schema/tarot.schema';
import OpenAI from 'openai';
import { TAROT_READER_PROMPT } from './prompts/tarot.prompt';

@Injectable()
export class OpenAILlmAdapter extends LlmPort {
  private static readonly TIMEOUT_MS = 10_000;
  private readonly client = new OpenAI();

  async getPrediction(
    question: string,
    style: Style,
    cards: Card[],
  ): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      OpenAILlmAdapter.TIMEOUT_MS,
    );
    const prompt = this.promptFormatter(question, style, cards);

    try {
      const response = await this.client.responses.create(
        this.getBody(prompt),
        {
          signal: controller.signal,
        },
      );

      return response.output_text;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private getBody(input: string) {
    return {
      model: 'gpt-5.4-nano',
      instructions: TAROT_READER_PROMPT,
      input,
    };
  }

  private promptFormatter(
    question: string,
    style: Style,
    cards: Card[],
  ): string {
    const cardsList = cards
      .map((card, index) => `${index + 1}. ${card.name}`)
      .join('\n');
    return `Question: ${question}, Style: ${style}, Cards in spread order: ${cardsList}.
    Respond in the same language as the question.`;
  }
}
