import { Module } from '@nestjs/common';
import { TarotController } from './tarot.controller';
import { TarotService } from './tarot.service';
import { LlmPort } from './llm/llm.port';
import { FakeLLMAdapter } from './llm/fake-llm.adapter';
import { OpenAIAdapter } from './llm/openai.adapter';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [TarotController],
  providers: [
    TarotService,
    FakeLLMAdapter,
    OpenAIAdapter,
    {
      provide: LlmPort,
      inject: [ConfigService, OpenAIAdapter, FakeLLMAdapter],
      useFactory: (
        configService: ConfigService,
        openai: OpenAIAdapter,
        fake: FakeLLMAdapter,
      ) =>
        configService.get<string>('LLM_PROVIDER') === 'openai' ? openai : fake,
    },
  ],
})
export class TarotModule {}
