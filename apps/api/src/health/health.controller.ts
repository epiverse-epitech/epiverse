import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthStatusDto } from './health-status.dto';

@ApiTags('health')
@SkipThrottle()
@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({ type: HealthStatusDto, description: 'The API is up.' })
  check(): HealthStatusDto {
    return { status: 'ok' };
  }
}
