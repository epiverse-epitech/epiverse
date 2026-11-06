import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TooManyLoginFailuresException } from '../security/login-attempts';
import {
  AllowPendingCgu,
  CurrentAccount,
  CurrentCguAccepted,
  CurrentRoles,
  CurrentSessionId,
  CurrentUserId,
  SessionGuard,
} from './session.guard';
import { AcceptCguDto } from './dto/accept-cgu.dto';
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
  constructor(private readonly auth: AuthService) {}

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
  async login(
    @Body() body: LoginDto,
    @Ip() clientIp: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SessionDto> {
    try {
      return await this.auth.login(body, clientIp);
    } catch (error) {
      if (error instanceof TooManyLoginFailuresException) {
        response.setHeader('Retry-After', error.retryAfterSeconds);
      }
      throw error;
    }
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
  ): CurrentAccountDto {
    return { ...account, cguAccepted, roles };
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
