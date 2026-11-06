import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
  login(@Body() body: LoginDto): Promise<SessionDto> {
    return this.auth.login(body);
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
