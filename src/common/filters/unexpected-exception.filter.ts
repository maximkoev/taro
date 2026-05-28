import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request } from 'express';
import { ApiResponseError, buildError } from './error.type';

@Catch()
export class UnexpectedErrorsFilter implements ExceptionFilter {
  private readonly logger = new Logger(UnexpectedErrorsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    if (exception instanceof HttpException)
      return this.handleHttpException(exception, ctx);
    return this.handleUnexpectedError(exception, ctx);
  }
  private handleHttpException(
    exception: HttpException,
    ctx: HttpArgumentsHost,
  ): void {
    const { httpAdapter } = this.httpAdapterHost;
    httpAdapter.reply(
      ctx.getResponse(),
      exception.getResponse(),
      exception.getStatus(),
    );
  }

  private handleUnexpectedError(
    exception: unknown,
    ctx: HttpArgumentsHost,
  ): void {
    const { httpAdapter } = this.httpAdapterHost;

    const { requestId } = ctx.getRequest<Request>();

    this.logger.error(
      { message: 'An unexpected error occurred', requestId },
      exception instanceof Error ? exception.stack : String(exception),
    );

    httpAdapter.reply(
      ctx.getResponse(),
      this.internalServerError,
      this.internalServerError.statusCode,
    );
  }
  private get internalServerError(): ApiResponseError {
    return buildError(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
