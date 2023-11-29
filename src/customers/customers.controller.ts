import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './customers-dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('create')
  async create(@Body(new ValidationPipe()) data: CreateCustomerDto) {
    return this.customersService.create(data);
  }
}
