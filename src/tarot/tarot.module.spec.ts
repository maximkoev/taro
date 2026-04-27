import 'reflect-metadata';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TarotModule } from './tarot.module';
import { TarotController } from './tarot.controller';
import { TarotService } from './tarot.service';
import { FakeLLMAdapter } from './llm/fake-llm.adapter';
import { LlmPort } from './llm/llm.port';
import { OpenAILlmAdapter } from './llm/openai-llm-adapter';

type FactoryProviderMetadata = {
  inject: unknown[];
  provide: unknown;
  useFactory: (...args: unknown[]) => unknown;
};

describe('TarotModule', () => {
  const originalLlmProvider = process.env.LLM_PROVIDER;
  const originalOpenAIApiKey = process.env.OPENAI_API_KEY;

  const compileModule = async (
    llmProvider?: string,
  ): Promise<TestingModule> => {
    const loadConfig = () => (llmProvider ? { LLM_PROVIDER: llmProvider } : {});

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

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'api-key';
    delete process.env.LLM_PROVIDER;
  });

  afterAll(() => {
    process.env.OPENAI_API_KEY = originalOpenAIApiKey;
    if (originalLlmProvider === undefined) {
      delete process.env.LLM_PROVIDER;
      return;
    }

    process.env.LLM_PROVIDER = originalLlmProvider;
  });

  it('declares the expected controllers and providers', () => {
    const controllers = Reflect.getMetadata('controllers', TarotModule) as
      | unknown[]
      | undefined;
    const providers = Reflect.getMetadata('providers', TarotModule) as
      | unknown[]
      | undefined;

    if (controllers) {
      expect(controllers).toEqual(expect.arrayContaining([TarotController]));
    }

    if (providers) {
      expect(providers).toEqual(
        expect.arrayContaining([
          TarotService,
          FakeLLMAdapter,
          OpenAILlmAdapter,
        ]),
      );

      const llmProvider = providers.find(
        (provider): provider is FactoryProviderMetadata =>
          typeof provider === 'object' &&
          provider !== null &&
          'provide' in provider &&
          provider.provide === LlmPort,
      );

      expect(llmProvider).toBeDefined();
      expect(llmProvider?.inject).toEqual([
        ConfigService,
        OpenAILlmAdapter,
        FakeLLMAdapter,
      ]);
      expect(typeof llmProvider?.useFactory).toBe('function');
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

    expect(moduleRef.get(LlmPort)).toBe(moduleRef.get(OpenAILlmAdapter));

    await moduleRef.close();
  });
});
