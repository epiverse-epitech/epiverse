import { Module } from '@nestjs/common';
import { PasswordService } from '../security/password.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionGuard } from './session.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService, SessionGuard],
})
export class AuthModule {}
