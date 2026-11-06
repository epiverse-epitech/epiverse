import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
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
}
