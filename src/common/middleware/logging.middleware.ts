import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const startedAt = Date.now();
    const requestId = req.requestId ?? req.header('x-request-id') ?? 'unknown';
    const url = req.originalUrl ?? req.url;
    let hasLogged = false;

    const writeLog = (aborted: boolean): void => {
      if (hasLogged) {
        return;
      }

      hasLogged = true;

      const durationMs = Date.now() - startedAt;
      const message = `${req.method} ${url} ${res.statusCode} ${durationMs}ms requestId=${requestId}`;

      if (aborted) {
        this.logger.warn(`${message} connection_closed`);
        return;
      }

      this.logger.log(message);
    };

    res.once('finish', () => writeLog(false));
    res.once('close', () => {
      if (!res.writableEnded) {
        writeLog(true);
      }
    });

    next();
  }
}
