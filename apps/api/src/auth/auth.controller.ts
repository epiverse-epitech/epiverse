import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AccountDto } from './dto/account.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthRateLimit } from '../security/auth-rate-limit.decorator';

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
}
