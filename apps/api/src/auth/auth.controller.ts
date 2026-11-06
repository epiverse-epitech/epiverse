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
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TooManyLoginFailuresException } from '../security/login-attempts';
import {
  CurrentAccount,
  CurrentSessionId,
  SessionGuard,
} from './session.guard';
import { AuthService } from './auth.service';
import { AccountDto } from './dto/account.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthRateLimit } from '../security/auth-rate-limit.decorator';
import { LoginDto } from './dto/login.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { SessionDto } from './dto/session.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

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
  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: AccountDto, description: 'Account of the session.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid session.' })
  me(@CurrentAccount() account: AccountDto): AccountDto {
    return account;
  }

  @UseGuards(SessionGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'Session revoked.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid session.' })
  logout(@CurrentSessionId() sessionId: number): Promise<void> {
    return this.auth.logout(sessionId);
  }
}
