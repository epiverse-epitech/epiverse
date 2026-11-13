import { Module } from '@nestjs/common';
import { PasswordService } from '../security/password.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
})
export class AuthModule {}
