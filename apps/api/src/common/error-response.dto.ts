import { ApiProperty } from '@nestjs/swagger';

// Shape of every error returned by the API.
export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: 'Bad Request' })
  error!: string;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: ['email must be an email'],
  })
  message!: string | string[];

  @ApiProperty({ example: '/api/auth/register' })
  path!: string;

  @ApiProperty({ format: 'date-time', example: '2026-10-31T10:00:00.000Z' })
  timestamp!: string;
}
