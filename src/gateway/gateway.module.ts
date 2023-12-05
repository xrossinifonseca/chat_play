import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { CustomersService } from 'src/customers/customers.service';
import { PasswordService } from 'src/customers/password.service';
import { PrismaService } from 'src/database/prismaService';

@Module({
  providers: [
    GatewayService,
    Server,
    AuthService,
    CustomersService,
    PasswordService,
    PrismaService,
  ],
})
export class GatewayModule {}
