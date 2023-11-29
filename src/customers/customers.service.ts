import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prismaService';
import { Customer } from './interfaces/customersInterace';
import { PasswordService } from './password.service';

@Injectable()
export class CustomersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  async create(data: Customer): Promise<Customer> {
    try {
      const customerExists = await this.findByEmail(data.email);

      if (customerExists) {
        throw new Error('customer already exists');
      }

      const hasPassword = await this.passwordService.hasPassword(data.password);

      data.password = hasPassword;

      const customer = await this.prisma.customer.create({
        data,
      });

      return customer;
    } catch (error) {
      console.error(error);

      throw new BadRequestException('Failed to create customer');
    }
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
