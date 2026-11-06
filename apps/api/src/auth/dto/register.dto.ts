import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsPassword } from '../../security/is-password.decorator';
import { normalizeEmail, trim } from './transforms';

// Maximum lengths match the columns of the users table.
export class RegisterDto {
  @ApiProperty({ example: 'ada@epitech.eu', maxLength: 255 })
  @Transform(normalizeEmail)
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({
    example: 'Lovelace1815',
    description: 'At least 8 characters, one uppercase letter and one digit.',
  })
  @IsPassword()
  password!: string;

  @ApiProperty({ example: 'Ada', maxLength: 50 })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName!: string;

  @ApiProperty({ example: 'Lovelace', maxLength: 50 })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName!: string;

  // Explicit acceptance of the terms of use (FR-AUTH-001): only the boolean
  // true is accepted, so a missing field, false or "true" are refused.
  @ApiProperty({
    example: true,
    description:
      'Must be true: the user accepts the current terms of use, recorded with their version and date.',
  })
  @Equals(true, { message: 'cguAccepted must be true' })
  cguAccepted!: true;
}
