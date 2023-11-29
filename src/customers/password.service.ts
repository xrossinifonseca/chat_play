import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async hasPassword(password: string): Promise<string> {
    try {
      const saltRounds = 10;

      return bcrypt.hash(password, saltRounds);
    } catch (error) {
      console.error(error);
      throw new Error('Error generating password hash');
    }
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error(error);
      throw new Error('error when comparing password');
    }
  }
}
