import { SetMetadata } from '@nestjs/common';

export const AUTH_RATE_LIMIT_KEY = 'authRateLimit';

// Applies AUTH_RATE_LIMIT_MAX instead of RATE_LIMIT_MAX.
// For routes that accept credentials or reveal whether an account exists:
// login, account recovery and registration.
export const AuthRateLimit = () => SetMetadata(AUTH_RATE_LIMIT_KEY, true);
