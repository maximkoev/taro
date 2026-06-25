import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiResponseError, buildError } from './error.type';
import {
  HttpAdapterHost,
  type HttpAdapterHost as HttpAdapterHostDependency,
} from '@nestjs/core';

type ZodErrorResponse = ApiResponseError & {
  errors: Array<{
    field: string;
    message: string;
  }>;
  path: string;
  requestId?: string;
};

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter<ZodError> {
  private readonly logger = new Logger(ZodExceptionFilter.name);
  constructor(
    @Inject(HttpAdapterHost)
    private readonly httpAdapterHost: HttpAdapterHostDependency,
  ) {}
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const payload: ZodErrorResponse = {
      ...buildError('Validation failed', HttpStatus.BAD_REQUEST),
      errors: exception.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
      path: request.url,
      requestId: request.requestId,
    };

    this.logger.error(payload);

    const adapter = this.httpAdapterHost.httpAdapter;
    adapter.reply(response, payload, HttpStatus.BAD_REQUEST);
  }
}
