import { ForbiddenException, Injectable } from '@nestjs/common';
import { CustomerLogin } from './auth.dto';
import { CustomersService } from 'src/customers/customers.service';
import { PasswordService } from 'src/customers/password.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseLogin } from './interfaces/ResponseLogin';
import { CustomerCreate } from 'src/customers/interfaces/customersInterace';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomersService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  async login(data: CustomerLogin): Promise<ResponseLogin> {

    data.email = data.email.toLowerCase()

    const customer = await this.customerService.findByEmail(data.email);

    if (!customer) {
      throw new Error('Email ou senha inválida');
    }

    const comparePassword = await this.passwordService.comparePassword(
      data.password,
      customer.password,
    );

    if (!comparePassword) {
      throw new Error('Email ou senha inválida');
    }

    const access_token = this.generateToken(customer);

    const response = {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
      token: access_token,
    };

    return response;
  }

  async signup(data: CustomerCreate): Promise<ResponseLogin> {
    const customer = await this.customerService.create(data);

    const access_token = this.generateToken(customer);

    const response = {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
      token: access_token,
    };

    return response;
  }

  private generateToken(data: { id: number; name: string }) {
    const payload = { id: data.id, name: data.name };

    return this.jwtService.sign(payload);
  }

  public decodeToken(token: string) {
    const decoded = this.jwtService.verify(token);

    if (!decoded) {
      throw new ForbiddenException('Acesso inválido');
    }

    return decoded;
  }
}
