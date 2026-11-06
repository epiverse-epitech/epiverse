import { ApiProperty } from '@nestjs/swagger';

export class SessionDto {
  @ApiProperty({
    description: 'Send it as "Authorization: Bearer <token>". Shown only once.',
  })
  token!: string;

  @ApiProperty({ format: 'date-time' })
  expiresAt!: string;
}
