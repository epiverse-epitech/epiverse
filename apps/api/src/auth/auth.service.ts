import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.validation';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../security/password.service';
import { AccountDto } from './dto/account.dto';
import { CguDto } from './dto/cgu.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  currentCgu(): CguDto {
    return { version: this.config.get('CGU_VERSION', { infer: true }) };
  }

  async register(dto: RegisterDto): Promise<AccountDto> {
    // The terms may have changed while the user was reading them: only the
    // current version can be accepted.
    const cguVersion = this.currentCgu().version;
    if (dto.cguVersion !== cguVersion) {
      throw new BadRequestException(
        'The terms of use have changed: accept the current version',
      );
    }

    const passwordHash = await this.passwords.hash(dto.password);

    try {
      const account = await this.prisma.users.create({
        data: {
          email: dto.email,
          password_hash: passwordHash,
          first_name: dto.firstName,
          last_name: dto.lastName,
          // Created in the same statement as the account, so an account never
          // exists without its recorded acceptance of the terms of use.
          user_cgu_acceptance: {
            create: { version: cguVersion },
          },
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
