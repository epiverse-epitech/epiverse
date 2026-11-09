import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccountDto } from '../auth/dto/account.dto';
import { CurrentAccountDto } from '../auth/dto/current-account.dto';
import {
  CurrentAccount,
  CurrentEmailVerified,
  CurrentUserId,
  SessionGuard,
} from '../auth/session.guard';
import { PathsService } from './paths.service';

// After registration, the user chooses a path (EPI-42). Only the student path
// exists for now; mentor and organization paths need an approval (EPI-41).
@ApiTags('paths')
@ApiBearerAuth()
@UseGuards(SessionGuard)
@Controller('me/paths')
export class PathsController {
  constructor(private readonly paths: PathsService) {}

  @Post('student')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CurrentAccountDto,
    description:
      'Student role given; the account as GET /api/auth/me shows it.',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid session.' })
  @ApiForbiddenResponse({
    description: 'The current terms of use are not accepted yet.',
  })
  async chooseStudent(
    @CurrentAccount() account: AccountDto,
    @CurrentUserId() userId: number,
    @CurrentEmailVerified() emailVerified: boolean,
  ): Promise<CurrentAccountDto> {
    const roles = await this.paths.chooseStudentPath(userId);
    // SessionGuard lets this route through only once the terms are accepted.
    return { ...account, cguAccepted: true, roles, emailVerified };
  }
}
