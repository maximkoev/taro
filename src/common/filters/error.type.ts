import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

export type ApiResponseError = {
  message: string;
  statusCode: HttpStatus;
  timestamp: string;
};
export type PrismaErrorConfig = {
  status: HttpStatus;
  publicMessage: string;
  logLevel?: 'warn' | 'error';
};

export function buildError(
  message: string,
  statusCode: HttpStatus,
): ApiResponseError {
  return {
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };
}
