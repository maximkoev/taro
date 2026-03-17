import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthService } from '../health/health.service';
import { HealthController } from '../health/health.controller';
import { RequestIdMiddleware } from '../common/middleware/request-id.middleware';
import { LoggerMiddleware } from '../common/middleware/logging.middleware';
import { ShutdownLoggerService } from '../common/shutdown.service';

@Module({
  imports: [],
  controllers: [AppController, HealthController],
  providers: [AppService, HealthService, ShutdownLoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
