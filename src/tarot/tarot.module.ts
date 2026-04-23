import { Module } from '@nestjs/common';
import { TarotController } from './tarot.controller';
import { TarotService } from './tarot.service';
import { LlmPort } from './llm/llm.port';
import { FakeLLMAdapter } from './llm/fake-llm.adapter';
import { OpenAILlmAdapter } from './llm/openai-llm-adapter';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [TarotController],
  providers: [
    TarotService,
    FakeLLMAdapter,
    OpenAILlmAdapter,
    {
      provide: LlmPort,
      inject: [ConfigService, OpenAILlmAdapter, FakeLLMAdapter],
      useFactory: (
        configService: ConfigService,
        openai: OpenAILlmAdapter,
        fake: FakeLLMAdapter,
      ) =>
        configService.get<string>('LLM_PROVIDER') === 'openai' ? openai : fake,
    },
  ],
})
export class TarotModule {}
