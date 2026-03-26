import { Controller, Post } from '@nestjs/common';
import { TarotService } from './tarot.service';
import {
  QuestionTarotDTO,
  PredictionTarotDTO,
  QuestionTaroSchema,
} from './tarot.schema';
import { ZodBody } from '../common/decorators/zod-body.decorator';

@Controller('tarot')
export class TarotController {
  constructor(private readonly tarotService: TarotService) {}
  @Post()
  tarot(
    @ZodBody(QuestionTaroSchema) body: QuestionTarotDTO,
  ): PredictionTarotDTO {
    return this.tarotService.tarot(body);
  }
}
