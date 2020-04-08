import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import generatePassword from 'password-generator';
import { BCRYPT_SALT_FACTOR } from 'settings';

@Injectable()
export class PasswordService {
  public async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(BCRYPT_SALT_FACTOR);
    return bcrypt.hash(password, salt);
  }

  public async compare(hash: string, password: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public async generatePassword(): Promise<{ password: string; hash: string }> {
    const password = generatePassword(6);
    const hash = await this.hash(password);

    return { password, hash };
  }
}
