import { ApiProperty } from '@nestjs/swagger';

export class CguDto {
  @ApiProperty({
    example: '1.0',
    description:
      'Current version of the terms of use. Send it back as cguVersion at registration.',
  })
  version!: string;
}
