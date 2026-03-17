import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ts = Date.now();
    res.on('finish', () => {
      const log: TLog = {
        requestId:
          (req as any).requestId ?? req.header('x-request-id') ?? 'unknown',
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        durationMS: Date.now() - ts,
      };
      console.log(log);
    });
    next();
  }
}

type TLog = {
  method: string;
  url: string;
  statusCode: number;
  requestId: string;
  durationMS: number;
};
