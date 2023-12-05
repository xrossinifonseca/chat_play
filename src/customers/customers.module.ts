import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { PrismaService } from '../database/prismaService';
import { PasswordService } from './password.service';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, PrismaService, PasswordService],
})
export class CustomersModule {}
