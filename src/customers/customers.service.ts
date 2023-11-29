import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prismaService';
import { Customer } from './interfaces/customersInterace';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Customer): Promise<Customer> {
    try {
      const customerExists = await this.findByEmail(data.email);

      if (customerExists) {
        throw new Error('customer already exists');
      }

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

  //   private validInput(data: Customer): void {
  //     const requiredFields: (keyof Customer)[] = ['name', 'email', 'password'];

  //     for (const field of requiredFields) {
  //       if (!data[field]) {
  //         throw new Error(`${field} is required`);
  //       }
  //     }

  //     if (data.password.length < 6) {
  //       throw new Error('password must be at least 6 characters');
  //     }
  //   }
}
