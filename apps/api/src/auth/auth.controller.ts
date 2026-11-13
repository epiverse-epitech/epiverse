import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AllowPendingCgu,
  CurrentAccount,
  CurrentCguAccepted,
  CurrentEmailVerified,
  CurrentRoles,
  CurrentSessionId,
  CurrentUserId,
  SessionGuard,
} from './session.guard';
import { AcceptCguDto } from './dto/accept-cgu.dto';
import {
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  ResetPasswordDto,
} from './dto/password-reset.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { PasswordResetService } from './password-reset.service';
import { EmailVerificationService } from './email-verification.service';
import { CurrentAccountDto } from './dto/current-account.dto';
import { AuthService } from './auth.service';
import { AccountDto } from './dto/account.dto';
import { CguDto } from './dto/cgu.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthRateLimit } from '../security/auth-rate-limit.decorator';
import { LoginDto } from './dto/login.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { SessionDto } from './dto/session.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly emailVerification: EmailVerificationService,
    private readonly passwordReset: PasswordResetService,
  ) {}

  @Get('cgu')
  @ApiOkResponse({ type: CguDto, description: 'Current terms of use version.' })
  cgu(): CguDto {
    return this.auth.currentCgu();
  }

  @AuthRateLimit()
  @Post('register')
  @ApiCreatedResponse({ type: AccountDto, description: 'Account created.' })
  register(@Body() body: RegisterDto): Promise<AccountDto> {
    return this.auth.register(body);
  }

  @AuthRateLimit()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SessionDto, description: 'Session opened.' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password.' })
  @ApiTooManyRequestsResponse({
    description:
      'Too many requests from this address, or too many failed logins for this account from this address.',
  })
  login(@Body() body: LoginDto, @Ip() clientIp: string): Promise<SessionDto> {
    return this.auth.login(body, clientIp);
  }

  @UseGuards(SessionGuard)
  @AllowPendingCgu()
  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: CurrentAccountDto,
    description: 'Account of the session.',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid session.' })
  me(
    @CurrentAccount() account: AccountDto,
    @CurrentCguAccepted() cguAccepted: boolean,
    @CurrentRoles() roles: string[],
    @CurrentEmailVerified() emailVerified: boolean,
  ): CurrentAccountDto {
    return { ...account, cguAccepted, roles, emailVerified };
  }

  @AuthRateLimit()
  @Post('email/verify')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Address confirmed.' })
  @ApiBadRequestResponse({ description: 'Invalid, expired or used link.' })
  verifyEmail(@Body() body: VerifyEmailDto): Promise<void> {
    return this.emailVerification.verify(body.token);
  }

  @AuthRateLimit()
  @UseGuards(SessionGuard)
  @AllowPendingCgu()
  @Post('email/resend')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBearerAuth()
  @ApiAcceptedResponse({
    description: 'A new link is on its way, unless the address is confirmed.',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid session.' })
  @ApiTooManyRequestsResponse({ description: 'Too many emails requested.' })
  resendVerification(@CurrentUserId() userId: number): Promise<void> {
    return this.emailVerification.resend(userId);
  }

  @AuthRateLimit()
  @Post('password/forgot')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    type: ForgotPasswordResponseDto,
    description: 'Same answer whether the account exists or not.',
  })
  @ApiTooManyRequestsResponse({ description: 'Too many emails requested.' })
  forgotPassword(
    @Body() body: ForgotPasswordDto,
    @Ip() clientIp: string,
  ): ForgotPasswordResponseDto {
    this.passwordReset.requestLink(body.email, clientIp);
    return {
      message: 'If an account exists for this address, a link has been sent',
    };
  }

  @AuthRateLimit()
  @Post('password/reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Password changed; every session of the account is revoked.',
  })
  @ApiBadRequestResponse({
    description:
      'Invalid, expired or used link, or password breaking the policy.',
  })
  resetPassword(
    @Body() body: ResetPasswordDto,
    @Ip() clientIp: string,
  ): Promise<void> {
    return this.passwordReset.reset(body.token, body.password, clientIp);
  }

  @UseGuards(SessionGuard)
  @AllowPendingCgu()
  @Post('cgu/accept')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'Acceptance recorded.' })
  @ApiBadRequestResponse({ description: 'Not the current version.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid session.' })
  acceptCgu(
    @CurrentUserId() userId: number,
    @Body() body: AcceptCguDto,
  ): Promise<void> {
    return this.auth.acceptCgu(userId, body.version);
  }

  @UseGuards(SessionGuard)
  @AllowPendingCgu()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'Session revoked.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid session.' })
  logout(@CurrentSessionId() sessionId: number): Promise<void> {
    return this.auth.logout(sessionId);
  }
}
