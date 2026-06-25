import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthService,
  type HealthService as HealthServiceDependency,
} from './health.service';
import { Public } from '../common/decorators/public-api.decorator';

@Public()
@Controller('health')
export class HealthController {
  constructor(
    @Inject(HealthService) private readonly hs: HealthServiceDependency,
  ) {}

  @Get('')
  health(): { status: string } {
    return this.hs.getHealth();
  }
}
