import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly hs: HealthService) {}
  @Get('/')
  health(): string {
    return this.hs.getHealth();
  }
}
