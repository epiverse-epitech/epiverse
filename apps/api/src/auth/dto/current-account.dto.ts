import { ApiProperty } from '@nestjs/swagger';
import { AccountDto } from './account.dto';

export class CurrentAccountDto extends AccountDto {
  @ApiProperty({
    description:
      'False when the current terms of use are not accepted yet: other protected routes answer 403 until POST /api/auth/cgu/accept.',
  })
  cguAccepted!: boolean;
}
