import { ConflictException, Injectable } from '@nestjs/common';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { IUser } from 'modules/database/interfaces/user';
import { User } from 'modules/database/models/user';

import { UserRepository } from '../repositories/user';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  public async update(model: IUser, currentUser: ICurrentUser): Promise<User> {
    delete model.id;

    const user = await this.userRepository.findById(currentUser.id);

    if (user.email !== model.email) {
      const isEmailAvailable = await this.userRepository.isEmailAvailable(model.email);
      if (!isEmailAvailable) throw new ConflictException('email-unavailable');
    }

    return this.userRepository.update({ ...user, ...model });
  }
}
