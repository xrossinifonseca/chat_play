import { CustomerProtectedPassword } from 'src/customers/interfaces/customersInterace';

export interface ResponseLogin {
  customer: CustomerProtectedPassword;
  token: string;
}
