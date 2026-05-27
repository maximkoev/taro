import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { Prisma } from '../../../generated/prisma/client';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { buildError, PrismaErrorConfig } from './error.type';
import { PRISMA_ERROR_MAP } from './prisma-error.map';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaClientExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private handleError(
    error: Prisma.PrismaClientKnownRequestError,
    ctx: HttpArgumentsHost,
    config: PrismaErrorConfig,
  ) {
    const { httpAdapter } = this.httpAdapterHost;
    const request = ctx.getRequest<Request>();

    const errorPayload = buildError(config.publicMessage, config.status);

    const logPayload = {
      requestId: request.requestId,
      prismaCode: error.code,
      message: error.message,
      method: request.method,
      url: request.url,
    };

    this.logger.error(logPayload, error.stack);
    httpAdapter.reply(ctx.getResponse(), errorPayload, config.status);
  }
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const config = PRISMA_ERROR_MAP[exception.code];
    const ctx = host.switchToHttp();

    if (config) {
      return this.handleError(exception, ctx, config);
    }
    throw exception;
  }
}
