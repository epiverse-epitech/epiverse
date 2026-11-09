import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsPassword } from '../../security/is-password.decorator';
import { normalizeEmail } from './transforms';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'ada@epitech.eu', maxLength: 255 })
  @Transform(normalizeEmail)
  @IsEmail()
  @MaxLength(255)
  email!: string;
}

// The answer is the same whether the account exists or not.
export class ForgotPasswordResponseDto {
  @ApiProperty({
    example: 'If an account exists for this address, a link has been sent',
  })
  message!: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token of the link received by email.',
    maxLength: 128,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  token!: string;

  @ApiProperty({ description: 'New password, under the password policy.' })
  @IsPassword()
  password!: string;
}
