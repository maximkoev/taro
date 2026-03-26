/* eslint-disable */
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { uuidRegex } from '../src/common/utils/uuid.util';

describe('Tarot (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('v1', { exclude: ['health'] });
    await app.init();
  });

  afterAll(async () => await app.close());

  it('POST /v1/tarot should return prediction with 3 cards and x-request-id', async () => {
    const payload = {
      question: 'Will I be lucky?',
      cards: 3,
      style: 'soft',
    } as const;

    const res = await request(app.getHttpServer())
      .post('/v1/tarot')
      .send(payload)
      .expect(201);

    expect(res.headers['x-request-id']).toMatch(uuidRegex);

    const body = res.body as {
      question: string;
      cards: unknown[];
      prediction: string;
    };

    expect(body.question).toBe(payload.question);
    expect(Array.isArray(body.cards)).toBe(true);
    expect(body.cards).toHaveLength(3);
    expect(typeof body.prediction).toBe('string');

    expect(res.headers['x-request-id']).toMatch(uuidRegex);
    expect(body).toEqual(
      expect.objectContaining({
        question: payload.question,
        cards: expect.any(Array),
        prediction: expect.any(String),
      }),
    );
    expect(res.body.cards).toHaveLength(3);
  });

  it('should preserve x-request-id when provided', async () => {
    const id = '123e4567-e89b-12d3-a456-426655440000';
    const payload = { question: 'Test', cards: 3, style: 'hard' };

    const res = await request(app.getHttpServer())
      .post('/v1/tarot')
      .set('x-request-id', id)
      .send(payload)
      .expect(201);

    expect(res.headers['x-request-id']).toBe(id);
  });
  it('should return predition', () => {
    const payload = {
      question: 'What is the meaning of life?',
      cards: 3,
      style: 'soft',
    };
    return request(app.getHttpServer())
      .post('/v1/tarot')
      .send(payload)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('prediction');
        expect(typeof res.body.prediction).toBe('string');
        expect(res.body).toHaveProperty('cards');
        expect(Array.isArray(res.body.cards)).toBeTruthy();
        expect(res.body.cards).toHaveLength(payload.cards);
        expect(res.body).toHaveProperty('question');
        expect(res.body.question).toBe(payload.question);
      });
  });
  it('should return valiadtion error if any of parameter is invalid', () => {
    const payload = {
      question: '',
      cards: 5,
      style: 'invalid',
    };
    return request(app.getHttpServer())
      .post('/v1/tarot')
      .send(payload)
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(Array.isArray(res.body.errors)).toBeTruthy();
        expect(res.body.message).toBe('Validation failed');
        expect(res.body.errors).toHaveLength(3);
        expect(res.body.errors).toContainEqual({
          path: 'question',
          message: 'Question is required',
        });
        expect(res.body.errors).toContainEqual({
          path: 'cards',
          message: 'Cards must be one of the following values: 3,6',
        });
        expect(res.body.errors).toContainEqual({
          path: 'style',
          message: "Style must be either 'soft' or 'hard'",
        });
      });
  });
});
