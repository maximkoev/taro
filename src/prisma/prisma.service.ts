import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from '../../env.helper';

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  constructor() {
    super({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
    });
    this.logger.log('PrismaService initialized');
  }
  onModuleDestroy() {
    this.logger.log(
      'PrismaService is being destroyed, disconnecting from database',
    );
    return this.$disconnect();
  }
  onModuleInit(): any {
    this.logger.log('Connect to db');
    return this.$connect();
  }
}
