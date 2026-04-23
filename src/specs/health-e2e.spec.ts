import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createE2EApp } from './e2e.setup';
import { uuidRegex } from '../common/utils/uuid.util';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.LLM_PROVIDER = 'fake';
    process.env.OPENAI_API_KEY = 'test-key';
    app = await createE2EApp();
  });

  afterAll(async () => await app.close());
  it('GET /health should return new x-request-id', () => {
    return request(app.getHttpServer())
      .get('/health/')
      .expect(200)
      .expect('x-request-id', uuidRegex);
  });

  it('GET /health should preserve x-request-id when provided', () => {
    const id = '123e4567-e89b-12d3-a456-426655440000';
    return request(app.getHttpServer())
      .get('/health/')
      .set('x-request-id', id)
      .expect(200)
      .expect('x-request-id', id);
  });
});
