import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prismaService';
import {
  Customer,
  CustomerCreate,
  CustomerProtectedPassword,
} from './interfaces/customersInterace';
import { PasswordService } from './password.service';

@Injectable()
export class CustomersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  async create(data: CustomerCreate): Promise<CustomerProtectedPassword> {
    const customerExists = await this.findByEmail(data.email);

    if (customerExists) {
      throw new Error('usuário ja cadastrado.');
    }

    const hasPassword = await this.passwordService.hasPassword(data.password);

    data.password = hasPassword;

    const customer = await this.prisma.customer.create({
      data,
    });

    const protectedPassword = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
    };

    return protectedPassword;
  }

  async findByEmail(email: string): Promise<Customer> {
    const customer = await this.prisma.customer.findFirst({
      where: {
        email,
      },
    });

    return customer;
  }


}
