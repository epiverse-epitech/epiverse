import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsPassword } from '../../security/is-password.decorator';

// Strips surrounding spaces so that a name made only of spaces counts as empty.
const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

// Maximum lengths match the columns of the users table.
export class RegisterDto {
  @ApiProperty({ example: 'ada@epitech.eu', maxLength: 255 })
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
}
