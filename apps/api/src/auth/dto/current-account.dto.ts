import { ApiProperty } from '@nestjs/swagger';
import { AccountDto } from './account.dto';

export class CurrentAccountDto extends AccountDto {
  @ApiProperty({
    description:
      'False when the current terms of use are not accepted yet: other protected routes answer 403 until POST /api/auth/cgu/accept.',
  })
  cguAccepted!: boolean;

  @ApiProperty({
    example: ['student'],
    description:
      'Role names of the account. Empty until a path is chosen (POST /api/me/paths/student).',
  })
  roles!: string[];

  @ApiProperty({
    description:
      'False until the link sent by email is opened (POST /api/auth/email/verify).',
  })
  emailVerified!: boolean;
}
