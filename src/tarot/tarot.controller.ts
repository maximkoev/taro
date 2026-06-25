import { Controller, Inject, Post } from '@nestjs/common';
import {
  TarotService,
  type TarotService as TarotServiceDependency,
} from './tarot.service';

import { ZodBody } from '../common/decorators/zod-body.decorator';
import { QuestionTaroSchema } from './schema/tarot.schema';
import type { QuestionTarotDTO } from './schema/tarot.schema';

@Controller('tarot')
export class TarotController {
  constructor(
    @Inject(TarotService)
    private readonly tarotService: TarotServiceDependency,
  ) {}

  @Post()
  tarot(@ZodBody(QuestionTaroSchema) body: QuestionTarotDTO) {
    return this.tarotService.tarot(body);
  }
}
