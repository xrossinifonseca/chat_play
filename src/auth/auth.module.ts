import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomersService } from 'src/customers/customers.service';
import { PrismaService } from 'src/database/prismaService';
import { PasswordService } from 'src/customers/password.service';
import { JwtModule } from '@nestjs/jwt';
import { CustomersModule } from 'src/customers/customers.module';
import { jwtConstants } from './constants';

@Module({
  imports: [
    CustomersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, CustomersService, PrismaService, PasswordService],
})
export class AuthModule {}
