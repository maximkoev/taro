import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app/app.module';
import { UnexpectedErrorsFilter } from '../common/filters/unexpected-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';

export async function createE2EApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  const host = app.get(HttpAdapterHost);

  app.setGlobalPrefix('v1', { exclude: ['health'] });
  app.useGlobalFilters(new UnexpectedErrorsFilter(host));
  app.enableShutdownHooks(['SIGTERM', 'SIGINT']);
  app.enableCors();
  await app.init();
  return app;
}
