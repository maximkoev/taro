import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

describe('AppModule', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => app.close());

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
});

const uuidRegex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/;
