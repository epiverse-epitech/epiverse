import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { STATUS_CODES } from 'node:http';
import { ErrorResponseDto } from './error-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    // originalUrl keeps the /api prefix; the query string is dropped (it may carry tokens).
    const path = request.originalUrl.split('?')[0];
    const { statusCode, error, message } = describeException(exception);

    if (statusCode >= 500) {
      // The details stay in the server logs only.
      this.logger.error(
        `${request.method} ${path} failed`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ErrorResponseDto = {
      statusCode,
      error,
      message,
      path,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(body);
  }
}

function describeException(
  exception: unknown,
): Pick<ErrorResponseDto, 'statusCode' | 'error' | 'message'> {
  if (!(exception instanceof HttpException)) {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Internal server error',
    };
  }

  const statusCode = exception.getStatus();

  // HTTP exceptions may also contain sensitive details (e.g. explicit 500/503).
  if (statusCode >= 500) {
    return {
      statusCode,
      error: STATUS_CODES[statusCode] ?? 'Server Error',
      message: 'Internal server error',
    };
  }

  const fallback = STATUS_CODES[statusCode] ?? 'HTTP Error';
  const payload = exception.getResponse();
  if (typeof payload === 'string') {
    return { statusCode, error: fallback, message: payload };
  }

  const data =
    payload !== null && typeof payload === 'object' && !Array.isArray(payload)
      ? (payload as Record<string, unknown>)
      : {};
  const rawMessage = data.message;
  const message: string | string[] =
    typeof rawMessage === 'string' ||
    (Array.isArray(rawMessage) &&
      rawMessage.every((item) => typeof item === 'string'))
      ? rawMessage
      : fallback;

  return {
    statusCode,
    error: typeof data.error === 'string' ? data.error : fallback,
    message,
  };
}
