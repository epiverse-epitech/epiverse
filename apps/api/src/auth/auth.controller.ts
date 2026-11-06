import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Post('register')
  register(@Body() body: RegisterDto): void {
    // Account creation comes in the next cycle; only validation exists for now.
    void body;
  }
}
