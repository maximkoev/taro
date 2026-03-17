import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const header = 'x-request-id';
    const id = req.header(header) ?? randomUUID();
    res.setHeader(header, id);
    (req as any).requestId = id;
    next();
  }
}
