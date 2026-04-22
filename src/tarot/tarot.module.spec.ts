import 'reflect-metadata';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TarotModule } from './tarot.module';
import { TarotController } from './tarot.controller';
import { TarotService } from './tarot.service';
import { FakeLLMAdapter } from './llm/fake-llm.adapter';
import { LlmPort } from './llm/llm.port';
import { OpenAIAdapter } from './llm/openai.adapter';

describe('TarotModule', () => {
  const compileModule = async (
    llmProvider?: string,
  ): Promise<TestingModule> => {
    const loadConfig = () =>
      llmProvider ? { LLM_PROVIDER: llmProvider } : {};

    return Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [loadConfig],
        }),
        TarotModule,
      ],
    }).compile();
  };

  it('declares the expected controllers and providers', () => {
    const controllers = Reflect.getMetadata('controllers', TarotModule) as
      | any[]
      | undefined;
    const providers = Reflect.getMetadata('providers', TarotModule) as
      | any[]
      | undefined;

    if (controllers) {
      expect(controllers).toEqual(expect.arrayContaining([TarotController]));
    }

    if (providers) {
      expect(providers).toEqual(
        expect.arrayContaining([
          TarotService,
          FakeLLMAdapter,
          OpenAIAdapter,
          expect.objectContaining({
            provide: LlmPort,
            inject: [ConfigService, OpenAIAdapter, FakeLLMAdapter],
            useFactory: expect.any(Function),
          }),
        ]),
      );
    }

    // Basic sanity: module should be defined
    expect(TarotModule).toBeDefined();
  });

  it('resolves FakeLLMAdapter by default', async () => {
    const moduleRef = await compileModule();

    expect(moduleRef.get(LlmPort)).toBe(moduleRef.get(FakeLLMAdapter));

    await moduleRef.close();
  });

  it('resolves FakeLLMAdapter when LLM_PROVIDER is fake', async () => {
    const moduleRef = await compileModule('fake');

    expect(moduleRef.get(LlmPort)).toBe(moduleRef.get(FakeLLMAdapter));

    await moduleRef.close();
  });

  it('resolves OpenAIAdapter when LLM_PROVIDER is openai', async () => {
    const moduleRef = await compileModule('openai');

    expect(moduleRef.get(LlmPort)).toBe(moduleRef.get(OpenAIAdapter));

    await moduleRef.close();
  });
});
