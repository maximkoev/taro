import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestIdMiddleware } from '../common/middleware/request-id.middleware';
import { LoggerMiddleware } from '../common/middleware/logging.middleware';
import { ShutdownLoggerService } from '../common/shutdown.service';
import { HealthModule } from '../health/health.module';
import { TarotModule } from '../tarot/tarot.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HealthModule,
    TarotModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService, ShutdownLoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, LoggerMiddleware).forRoutes('*');
  }
}
