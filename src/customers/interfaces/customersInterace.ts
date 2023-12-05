export interface Customer {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface CustomerCreate extends Omit<Customer, 'id'> {}

export interface CustomerProtectedPassword extends Omit<Customer, 'password'> {}
