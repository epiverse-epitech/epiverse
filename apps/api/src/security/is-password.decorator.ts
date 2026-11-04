import { applyDecorators } from '@nestjs/common';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

// Password rules from the mockups: at least 8 characters, an uppercase letter and a digit,
// without whitespace that could be accidentally introduced or trimmed inconsistently.
// The 128-character cap stops oversized inputs from making Argon2 hashing costly.
export function IsPassword(): PropertyDecorator {
  return applyDecorators(
    IsString(),
    MinLength(8),
    MaxLength(128),
    Matches(/^\S+$/, {
      message: '$property must not contain whitespace',
    }),
    Matches(/[A-Z]/, { message: '$property must contain an uppercase letter' }),
    Matches(/\d/, { message: '$property must contain a digit' }),
  );
}
