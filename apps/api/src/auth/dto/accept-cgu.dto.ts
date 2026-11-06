import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AcceptCguDto {
  @ApiProperty({
    example: '1.0',
    maxLength: 20,
    description:
      'Version of the terms of use the user accepted, as served by GET /api/auth/cgu.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  version!: string;
}
