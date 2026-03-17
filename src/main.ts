import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks(['SIGTERM', 'SIGINT']).enableCors();
  await app.listen(process.env.PORT ?? 3000);
  const url = await app.getUrl();
  new Logger().log(`Server is running on ${url}`);
}

void bootstrap().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
