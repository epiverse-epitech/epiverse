import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../security/password.service';
import { AccountDto } from './dto/account.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
  ) {}

  async register(dto: RegisterDto): Promise<AccountDto> {
    const account = await this.prisma.users.create({
      data: {
        email: dto.email,
        password_hash: await this.passwords.hash(dto.password),
        first_name: dto.firstName,
        last_name: dto.lastName,
      },
      // Only public columns are read back, so the hash never leaves the database.
      select: {
        public_id: true,
        email: true,
        first_name: true,
        last_name: true,
      },
    });

    return {
      id: account.public_id,
      email: account.email,
      firstName: account.first_name,
      lastName: account.last_name,
    };
  }
}
