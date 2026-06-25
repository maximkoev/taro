import 'reflect-metadata';
import type { MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';
import { HealthModule } from '../health/health.module';
import { TarotModule } from '../tarot/tarot.module';
import { UserModule } from '../user/user.module';
import { LoggerMiddleware } from '../common/middleware/logging.middleware';
import { RequestIdMiddleware } from '../common/middleware/request-id.middleware';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShutdownLoggerService } from '../common/shutdown.service';

describe('AppModule', () => {
  it('should be defined', () => {
    expect(AppModule).toBeDefined();
  });

  it('declares feature modules and global config', async () => {
    const imports = Reflect.getMetadata('imports', AppModule) as unknown[];
    const resolvedImports = await Promise.all(imports);

    expect(imports).toEqual(
      expect.arrayContaining([
        UserModule,
        HealthModule,
        TarotModule,
        AuthModule,
      ]),
    );
    expect(resolvedImports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          global: true,
          module: ConfigModule,
        }),
      ]),
    );
  });

  it('declares the app controller, services, and global JWT guard', () => {
    const controllers = Reflect.getMetadata(
      'controllers',
      AppModule,
    ) as unknown[];
    const providers = Reflect.getMetadata('providers', AppModule) as unknown[];

    expect(controllers).toEqual(expect.arrayContaining([AppController]));
    expect(providers).toEqual(
      expect.arrayContaining([
        AppService,
        ShutdownLoggerService,
        {
          provide: 'APP_GUARD',
          useClass: JwtAuthGuard,
        },
      ]),
    );
  });

  it('applies request id and logging middleware to every route', () => {
    const forRoutes = jest.fn();
    const apply = jest.fn().mockReturnValue({ forRoutes });
    const module = new AppModule();

    module.configure({ apply } as unknown as MiddlewareConsumer);

    expect(apply).toHaveBeenCalledWith(RequestIdMiddleware, LoggerMiddleware);
    expect(forRoutes).toHaveBeenCalledWith('*');
  });
});
