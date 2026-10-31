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
    // An unexpected error may carry internal details: only a generic message leaves the server.
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Internal server error',
    };
  }

  const statusCode = exception.getStatus();
  // Built-in exceptions carry { message, error }; custom ones may carry a plain string.
  const payload = exception.getResponse();
  const { message, error } =
    typeof payload === 'string'
      ? { message: payload, error: undefined }
      : (payload as { message: string | string[]; error?: string });

  return {
    statusCode,
    error: error ?? STATUS_CODES[statusCode] ?? 'Error',
    message,
  };
}
