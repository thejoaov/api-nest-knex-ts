import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { IResetPasswordToken } from 'modules/common/interfaces/resetPassword';
import { IMail, MailService } from 'modules/common/services/mail';
import { PasswordService } from 'modules/common/services/password';
import { enTokenType, TokenService } from 'modules/common/services/token';
import { UrlService } from 'modules/common/services/url';
import { User } from 'modules/database/models/user';

import { UserRepository } from '../repositories/user';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private mailService: MailService,
    private urlService: UrlService,
    private userRepository: UserRepository,
    private passwordService: PasswordService
  ) {}

  public async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException();

    const isValid = await this.passwordService.compare(user.password, password);
    if (!isValid) throw new BadRequestException();

    return this.tokenService.generateAccessToken(user);
  }

  public async changePassword(userToken: ICurrentUser, oldPassword: string, newPassword: string): Promise<User> {
    const user = await this.userRepository.findById(userToken.id);

    const isValid = await this.passwordService.compare(user.password, oldPassword);
    if (!isValid) throw new BadRequestException();

    user.password = await this.passwordService.hash(newPassword);
    return this.userRepository.update(user);
  }

  public async sendResetPassword(email: string): Promise<IMail> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException();

    const token = await this.tokenService.resetPassword(user);
    return this.mailService.send(user.email, 'Recuperar Acesso', 'user-reset-password', {
      ...user,
      url: this.urlService.resetPassword(token)
    });
  }

  public async resetPassword(token: string, newPassword: string): Promise<User> {
    const info = await this.tokenService.verify<IResetPasswordToken>(token, enTokenType.resetPassword);
    const user = await this.userRepository.findById(info.id);

    if (!user) throw new NotFoundException();
    user.password = await this.passwordService.hash(newPassword);

    return this.userRepository.update(user);
  }
}
