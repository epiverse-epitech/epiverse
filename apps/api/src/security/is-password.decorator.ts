import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';

// NIST SP 800-63B-4: 15+ characters for a password used as a single factor;
// do not impose uppercase, digit, symbol or no-whitespace composition rules.
// Screen commonly used / compromised passwords at registration (not implemented yet).
// The 128-character cap exceeds the NIST-recommended minimum maximum (64).
export function IsPassword(): PropertyDecorator {
  return applyDecorators(IsString(), MinLength(15), MaxLength(128));
}
