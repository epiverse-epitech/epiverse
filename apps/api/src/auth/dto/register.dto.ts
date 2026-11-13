import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsPassword } from '../../security/is-password.decorator';

// Strips surrounding spaces so that a name made only of spaces counts as empty.
const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

// Emails are stored in lowercase, matching the unique index on lower(email).
const normalizeEmail = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

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

  // Explicit acceptance of the terms of use (FR-AUTH-001): the client sends
  // the version it displayed, read from GET /api/auth/cgu. The service refuses
  // a version that is no longer the current one.
  @ApiProperty({
    example: '1.0',
    maxLength: 20,
    description:
      'Version of the terms of use the user accepted, as served by GET /api/auth/cgu.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  cguVersion!: string;
}
