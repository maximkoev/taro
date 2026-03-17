import { Test } from '@nestjs/testing';
import { HealthModule } from './health.module';
import { HealthService } from './health.service';

describe('HealthModule', () => {
  let healthModule: HealthModule;
  let healthService: HealthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    healthModule = moduleRef.get(HealthModule);
    healthService = moduleRef.get(HealthService);
  });

  it('should be defined', () => {
    expect(healthModule).toBeDefined();
  });

  it('should provide HealthService', () => {
    expect(healthService).toBeInstanceOf(HealthService);
  });

  it('HealthService#getHealth should return OK', () => {
    expect(healthService.getHealth()).toBe('OK');
  });
});
