import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(() => {
    service = new HealthService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getHealth should return OK', () => {
    expect(service.getHealth()).toStrictEqual({ status: 'ok' });
  });
});
