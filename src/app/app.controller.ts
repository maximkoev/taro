import { Controller, Inject } from '@nestjs/common';
import {
  AppService,
  type AppService as AppServiceDependency,
} from './app.service';

@Controller()
export class AppController {
  constructor(
    @Inject(AppService) private readonly appService: AppServiceDependency,
  ) {}
}
