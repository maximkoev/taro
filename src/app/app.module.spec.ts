import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { uuidRegex } from '../common/utils/uuid.util';
import { isArrayLike } from 'rxjs/internal/util/isArrayLike';

describe('AppModule', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => app.close());

  it('should be defined', () => {
    expect(AppModule).toBeDefined();
  });
  it('should return new x-request-id', () => {
    return request(app.getHttpServer())
      .get('/health/')
      .expect(200)
      .expect('x-request-id', uuidRegex);
  });
  it('should return same x-request-id', () => {
    const id = '123e4567-e89b-12d3-a456-426655440000';
    return request(app.getHttpServer())
      .get('/health/')
      .set('x-request-id', id)
      .expect(200)
      .expect('x-request-id', id);
  });
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  it('/tarot POST', () => {
    const payload = {
      question: 'What is the meaning of life?',
      cards: 3,
      style: 'soft',
    };
    return request(app.getHttpServer())
      .post('/tarot')
      .send(payload)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('prediction');
        expect(typeof res.body.prediction).toBe('string');
        expect(res.body).toHaveProperty('cards');
        expect(isArrayLike<string>(res.body.cards)).toBeTruthy();
        expect(res.body.cards).toHaveLength(payload.cards);
        expect(res.body).toHaveProperty('question');
        expect(res.body.question).toBe(payload.question);
      });
  });
  it('/tarot POST should return question error', () => {
    const payload = {
      question: 1,
      cards: 3,
      style: 'soft',
    };
    return request(app.getHttpServer())
      .post('/tarot')
      .send(payload)
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('Validation failed');
        expect(res.body.errors[0].path).toBe('question');
        expect(res.body.errors[0].message).toBe(
          'Invalid input: expected string, received number',
        );
      });
  });

  it('/tarot POST should return cards error validation. Wrong value', () => {
    const payload = {
      question: 'What is the meaning of life?',
      cards: 4,
      style: 'soft',
    };
    return request(app.getHttpServer())
      .post('/tarot')
      .send(payload)
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('Validation failed');
        expect(res.body.errors[0].path).toBe('cards');
        expect(res.body.errors[0].message).toContain(
          'Cards must be one of the following values',
        );
      });
  });

  it('/tarot POST should return cards error validation. wrong type', () => {
    const payload = {
      question: 'What is the meaning of life?',
      cards: 'three',
      style: 'soft',
    };
    return request(app.getHttpServer())
      .post('/tarot')
      .send(payload)
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('Validation failed');
        expect(res.body.errors[0].path).toBe('cards');
        expect(res.body.errors[0].message).toBe(
          'Invalid input: expected number, received string',
        );
      });
  });

  it('/tarot POST should return style error validation. wrong value', () => {
    const payload = {
      question: 'What is the meaning of life?',
      cards: 3,
      style: 'invalid',
    };
    return request(app.getHttpServer())
      .post('/tarot')
      .send(payload)
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('Validation failed');
        expect(res.body.errors[0].path).toBe('style');
        expect(res.body.errors[0].message).toBe(
          "Style must be either 'soft' or 'hard'",
        );
      });
  });

  it('/tarot POST should return style error validation. wrong type', () => {
    const payload = {
      question: 'What is the meaning of life?',
      cards: 3,
      style: 5,
    };
    return request(app.getHttpServer())
      .post('/tarot')
      .send(payload)
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('Validation failed');
        expect(res.body.errors[0].path).toBe('style');
        expect(res.body.errors[0].message).toBe(
          "Style must be either 'soft' or 'hard'",
        );
      });
  });
  it('/tarot POST should return error array when all parameters invalid', () => {
    const payload = {
      question: 3,
      cards: '3',
      style: 5,
    };
    return request(app.getHttpServer())
      .post('/tarot')
      .send(payload)
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('Validation failed');
        expect(res.body.errors.find((e) => e.path === 'cards')).toBeTruthy();
        expect(res.body.errors.find((e) => e.path === 'style')).toBeTruthy();
        expect(res.body.errors.find((e) => e.path === 'question')).toBeTruthy();
      });
  });
});
