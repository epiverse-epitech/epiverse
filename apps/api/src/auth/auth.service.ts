import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
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
    const passwordHash = await this.passwords.hash(dto.password);

    try {
      const account = await this.prisma.users.create({
        data: {
          email: dto.email,
          password_hash: passwordHash,
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
    } catch (error) {
      // The unique index on lower(email) is the real guard: checking before
      // inserting would let two simultaneous requests both pass.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'An account already exists with this email',
        );
      }
      throw error;
    }
  }
}
