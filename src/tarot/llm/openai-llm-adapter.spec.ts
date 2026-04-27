import { Card } from '../../domain/card';
import { TAROT_READER_PROMPT } from './prompts/tarot.prompt';

const mockResponsesCreate = jest.fn();

jest.mock('openai', () => ({
  __esModule: true,
  ...jest.requireActual<typeof import('openai')>('openai'),
  default: jest.fn().mockImplementation(() => ({
    responses: {
      create: mockResponsesCreate,
    },
  })),
}));

import OpenAI, { APIUserAbortError } from 'openai';
import { OpenAILlmAdapter } from './openai-llm-adapter';

describe('OpenAILlmAdapter', () => {
  let adapter: OpenAILlmAdapter;

  const cards: Card[] = [
    { id: '1', name: 'The Fool' },
    { id: '2', name: 'The Star' },
    { id: '3', name: 'The Sun' },
  ];

  beforeEach(() => {
    jest.mocked(OpenAI).mockClear();
    mockResponsesCreate.mockReset();
    adapter = new OpenAILlmAdapter();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('creates the OpenAI client once', () => {
    expect(jest.mocked(OpenAI)).toHaveBeenCalledTimes(1);
  });

  it('calls the OpenAI responses API with the formatted prompt and returns output_text', async () => {
    mockResponsesCreate.mockResolvedValue({ output_text: 'A clear reading.' });

    const result = await adapter.getPrediction(
      'What should I focus on?',
      'hard',
      cards,
    );

    expect(mockResponsesCreate).toHaveBeenCalledTimes(1);

    const [body, options] = mockResponsesCreate.mock.calls[0] as [
      {
        input: string;
        instructions: string;
        model: string;
      },
      { signal: AbortSignal },
    ];

    expect(body).toEqual(
      expect.objectContaining({
        model: 'gpt-5.4-nano',
        instructions: TAROT_READER_PROMPT,
      }),
    );
    expect(body.input).toContain(
      'Question: What should I focus on?, Style: hard',
    );
    expect(body.input).toContain(
      'Cards in spread order: 1. The Fool\n2. The Star\n3. The Sun.',
    );
    expect(body.input).toContain(
      'Respond in the same language as the question.',
    );
    expect(options.signal.aborted).toBe(false);
    expect(result).toBe('A clear reading.');
  });

  it('propagates OpenAI client errors', async () => {
    const error = new Error('OpenAI unavailable');
    mockResponsesCreate.mockRejectedValue(error);

    await expect(
      adapter.getPrediction('What should I focus on?', 'soft', cards),
    ).rejects.toThrow('OpenAI unavailable');
  });

  it('aborts the OpenAI request when it times out', async () => {
    jest.useFakeTimers();

    mockResponsesCreate.mockImplementation(
      (_body: unknown, options?: { signal?: AbortSignal }) =>
        new Promise((_, reject) => {
          options?.signal?.addEventListener('abort', () => {
            reject(new APIUserAbortError());
          });
        }),
    );

    const predictionPromise = adapter.getPrediction(
      'What should I focus on?',
      'soft',
      cards,
    );
    const [, options] = mockResponsesCreate.mock.calls[0] as [
      unknown,
      { signal: AbortSignal },
    ];
    const rejection =
      expect(predictionPromise).rejects.toBeInstanceOf(APIUserAbortError);

    expect(options.signal.aborted).toBe(false);

    await jest.advanceTimersByTimeAsync(10_000);

    await rejection;
    expect(options.signal.aborted).toBe(true);
  });
});
