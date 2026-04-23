import { Controller, Post } from '@nestjs/common';
import { TarotService } from './tarot.service';

import { ZodBody } from '../common/decorators/zod-body.decorator';
import {
  PredictionTarotDTO,
  QuestionTaroSchema,
  QuestionTarotDTO,
} from './schema/tarot.schema';

@Controller('tarot')
export class TarotController {
  constructor(private readonly tarotService: TarotService) {}
  @Post()
  tarot(
    @ZodBody(QuestionTaroSchema) body: QuestionTarotDTO,
  ): Promise<PredictionTarotDTO> {
    return this.tarotService.tarot(body);
  }
}
