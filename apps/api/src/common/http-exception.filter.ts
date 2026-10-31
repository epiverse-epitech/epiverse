import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { STATUS_CODES } from 'node:http';

// Shape of every error returned by the API.
export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  timestamp: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const statusCode = exception.getStatus();

    // Built-in exceptions carry { message, error }; custom ones may carry a plain string.
    const payload = exception.getResponse();
    const { message, error } =
      typeof payload === 'string'
        ? { message: payload, error: undefined }
        : (payload as { message: string | string[]; error?: string });

    const body: ErrorResponse = {
      statusCode,
      error: error ?? STATUS_CODES[statusCode] ?? 'Error',
      message,
      path: request.originalUrl.split('?')[0],
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(body);
  }
}
