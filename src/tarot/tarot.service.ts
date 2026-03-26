import { Injectable } from '@nestjs/common';
import { Deck } from '../domain/cards';
import { PredictionTarotDTO, QuestionTarotDTO } from './tarot.schema';

@Injectable()
export class TarotService {
  tarot(question: QuestionTarotDTO): PredictionTarotDTO {
    const cards = new Deck().draw(question.cards);
    return askAI(question, cards);
  }
}

function askAI(
  question: QuestionTarotDTO,
  cards: string[],
): PredictionTarotDTO {
  const prediction = buildPrediction(question, cards);
  return {
    question: question.question,
    cards,
    prediction,
  };
}

function buildPrediction(question: QuestionTarotDTO, cards: string[]): string {
  const base = `For your question "${question.question}", the cards drawn (${cards.join(', ')}) suggest a gentle and optimistic outlook. The prediction is: `;
  if (question.style === 'soft') {
    return `${base} things will likely unfold in a positive manner, with opportunities for growth and happiness. Embrace the journey with an open heart.`;
  }
  return `${base} there may be challenges ahead, but with resilience and determination, you can overcome them. Stay strong and keep moving forward.`;
}
