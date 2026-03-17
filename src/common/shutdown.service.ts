import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';

@Injectable()
export class ShutdownLoggerService implements OnApplicationShutdown {
  private readonly logger = new Logger(ShutdownLoggerService.name);

  onApplicationShutdown(signal?: string) {
    this.logger.log(`Shutting down${signal ? ` (signal: ${signal})` : ''}`);
  }
}
