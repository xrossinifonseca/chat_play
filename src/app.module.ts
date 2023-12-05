import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [CustomersModule, AuthModule, GatewayModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
