import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1', { exclude: ['health'] });
  app.enableShutdownHooks(['SIGTERM', 'SIGINT']);
  app.enableCors();

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  const url = await app.getUrl();
  logger.log(`Server is running on ${url}`);
}

void bootstrap().catch((e: unknown) => {
  const err = e instanceof Error ? e.stack : String(e);
  logger.error('Failed to start Application', err);
  process.exitCode = 1;
});
