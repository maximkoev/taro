import { Card } from '../../domain/card';
import { TAROT_READER_PROMPT } from './prompts/tarot.prompt';

const mockResponsesCreate = jest.fn();
const mockOpenAI = jest.fn().mockImplementation(() => ({
  responses: {
    create: mockResponsesCreate,
  },
}));

jest.mock('openai', () => ({
  __esModule: true,
  default: mockOpenAI,
}));

import { OpenAILlmAdapter } from './openai-llm-adapter';

describe('OpenAILlmAdapter', () => {
  const originalApiKey = process.env.OPENAI_API_KEY;
  let adapter: OpenAILlmAdapter;

  const cards: Card[] = [
    { id: '1', name: 'The Fool' },
    { id: '2', name: 'The Star' },
    { id: '3', name: 'The Sun' },
  ];

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-api-key';
    mockOpenAI.mockClear();
    mockResponsesCreate.mockReset();
    adapter = new OpenAILlmAdapter();
  });

  afterAll(() => {
    process.env.OPENAI_API_KEY = originalApiKey;
  });

  it('creates the OpenAI client with OPENAI_API_KEY', () => {
    expect(mockOpenAI).toHaveBeenCalledTimes(1);
  });

  it('formats the tarot prompt with ordered cards and language instruction', () => {
    const prompt = adapter.promptFormatter(
      'What should I focus on?',
      'soft',
      cards,
    );

    expect(prompt).toContain('Question: What should I focus on?, Style: soft');
    expect(prompt).toContain(
      'Cards in spread order: 1. The Fool\n2. The Star\n3. The Sun.',
    );
    expect(prompt).toContain('Respond in the same language as the question.');
  });

  it('calls the OpenAI responses API with the formatted prompt and returns output_text', async () => {
    const promptSpy = jest
      .spyOn(adapter, 'promptFormatter')
      .mockReturnValue('FORMATTED_PROMPT');
    mockResponsesCreate.mockResolvedValue({ output_text: 'A clear reading.' });

    const result = await adapter.getPrediction(
      'What should I focus on?',
      'hard',
      cards,
    );

    expect(promptSpy).toHaveBeenCalledWith(
      'What should I focus on?',
      'hard',
      cards,
    );
    expect(mockResponsesCreate).toHaveBeenCalledTimes(1);
    expect(mockResponsesCreate).toHaveBeenCalledWith({
      model: 'gpt-5.4-nano',
      instructions: TAROT_READER_PROMPT,
      input: 'FORMATTED_PROMPT',
    });
    expect(result).toBe('A clear reading.');
  });

  it('propagates OpenAI client errors', async () => {
    const error = new Error('OpenAI unavailable');
    mockResponsesCreate.mockRejectedValue(error);

    await expect(
      adapter.getPrediction('What should I focus on?', 'soft', cards),
    ).rejects.toThrow('OpenAI unavailable');
  });
});
