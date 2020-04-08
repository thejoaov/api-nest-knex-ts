import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { MailService } from 'modules/common/services/mail';
import { PasswordService } from 'modules/common/services/password';
import { enRoles, IUser, listPublicRoles } from 'modules/database/interfaces/user';
import { User } from 'modules/database/models/user';

import { UserRepository } from '../repositories/user';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private passwordService: PasswordService,
    private mailService: MailService
  ) {}

  public async save(model: IUser): Promise<User> {
    if (!model.roles || model.roles.length === 0) {
      throw new BadRequestException('roles-required');
    }

    if (model.roles.includes(enRoles.sysAdmin)) {
      throw new BadRequestException('not-allowed-to-change-sysAdmin');
    }

    if (!model.roles.every(r => listPublicRoles().includes(r))) {
      throw new BadRequestException('invalid-roles');
    }

    if (model.id) return this.update(model);
    return this.create(model);
  }

  public async remove(userId: number, currentUser: ICurrentUser): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('not-found');
    }

    if (user.id === currentUser.id) {
      throw new BadRequestException('not-allowed-remove-current-user');
    }

    if (user.isSysAdmin()) {
      throw new BadRequestException('not-allowed-remove-sysAdmin');
    }

    return this.userRepository.remove(userId);
  }

  private async create(model: IUser): Promise<User> {
    const isEmailAvailable = await this.userRepository.isEmailAvailable(model.email);
    if (!isEmailAvailable) throw new ConflictException('email-unavailable');

    const { password, hash } = await this.passwordService.generatePassword();
    model.password = hash;

    const user = await this.userRepository.insert(model);
    await this.mailService.send(user.email, 'Bem Vindo!', 'user-create', { ...user, password });

    return user;
  }

  private async update(model: IUser): Promise<User> {
    const isEmailAvailable = await this.userRepository.isEmailAvailable(model.email, model.id);
    if (!isEmailAvailable) throw new ConflictException('email-unavailable');

    const user = await this.userRepository.findById(model.id);

    if (!user) throw new NotFoundException('not-found');
    if (user.isSysAdmin()) throw new BadRequestException('not-allowed-to-change-sysAdmin');

    return this.userRepository.update({ ...user, ...model });
  }
}
