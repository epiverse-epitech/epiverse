import { ApiProperty } from '@nestjs/swagger';

// Public view of an account: never the password hash nor the internal numeric id.
export class AccountDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'ada@epitech.eu' })
  email!: string;

  @ApiProperty({ example: 'Ada' })
  firstName!: string;

  @ApiProperty({ example: 'Lovelace' })
  lastName!: string;
}
