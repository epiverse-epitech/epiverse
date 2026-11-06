import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AccountDto } from './dto/account.dto';
import { CguDto } from './dto/cgu.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthRateLimit } from '../security/auth-rate-limit.decorator';

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
}
