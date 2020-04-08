import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MailService } from 'modules/common/services/mail';
import { PasswordService } from 'modules/common/services/password';
import { TokenService } from 'modules/common/services/token';
import { UrlService } from 'modules/common/services/url';

import { UserRepository } from '../repositories/user';
import { AuthService } from './auth';

describe('Admin/AuthService', () => {
  let tokenService: TokenService;
  let mailService: MailService;
  let urlService: UrlService;
  let userRepository: UserRepository;
  let passwordService: PasswordService;
  let service: AuthService;

  beforeEach(async () => {
    tokenService = new TokenService();
    mailService = new MailService(null);
    urlService = new UrlService();
    userRepository = new UserRepository();
    passwordService = new PasswordService();

    service = new AuthService(tokenService, mailService, urlService, userRepository, passwordService);
  });

  it('should return token for a valid user when try to login', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({ password: 'senha' } as any);
    jest.spyOn(passwordService, 'compare').mockResolvedValueOnce(true);
    jest.spyOn(tokenService, 'generateAccessToken').mockResolvedValueOnce('app_access_token');

    const result = await service.login('email', 'senha');

    expect(result).not.toBeFalsy();
    expect(result).toEqual('app_access_token');
  });

  it('should throw NotFoundException when user was not found', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);

    try {
      await service.login('email', 'senha');
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should throw BadRequestException when password doesn`t match', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({ password: 'senha' } as any);
    jest.spyOn(passwordService, 'compare').mockResolvedValueOnce(false);

    try {
      await service.login('email', 'senha');
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should return user when try to change password', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({ id: 1, password: '123@senha' } as any);
    jest.spyOn(userRepository, 'update').mockImplementationOnce(model => Promise.resolve(model as any));
    jest.spyOn(passwordService, 'compare').mockResolvedValueOnce(true);
    jest.spyOn(passwordService, 'hash').mockResolvedValueOnce('hashpassword');

    const user = await service.changePassword({ id: 1 } as any, '123@senha', '1234@senha');
    expect(user.password).toBe('hashpassword');
  });

  it('should throw BadRequestException when try to change password and the password doesn`t match', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({ id: 1, password: '123@senha' } as any);
    jest.spyOn(passwordService, 'compare').mockResolvedValueOnce(false);

    try {
      await service.changePassword({ id: 1 } as any, '123@senha', '1234@senha');
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should sendResetPassword', async () => {
    jest
      .spyOn(userRepository, 'findByEmail')
      .mockResolvedValueOnce({ id: 1, password: '123@senha', email: 'teste@email.com' } as any);
    jest.spyOn(tokenService, 'resetPassword').mockResolvedValueOnce('resetPassword');
    jest.spyOn(urlService, 'resetPassword').mockReturnValueOnce('urlResetPassword');
    jest
      .spyOn(mailService, 'send')
      .mockImplementationOnce((to, subject, template, data) =>
        Promise.resolve({ to, subject, template, data, html: '', from: '' })
      );

    const mail = await service.sendResetPassword('teste@email.com');
    expect(mail.to).toBe('teste@email.com');
    expect(mail.subject).toBe('Recuperar Acesso');
    expect(mail.template).toBe('user-reset-password');
    expect((mail as any).data.url).toBe('urlResetPassword');
  });

  it('should throw NotFoundException when try to sendPassword and user was not found', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);

    try {
      await service.sendResetPassword('teste@email.com');
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should changePassword', async () => {
    jest.spyOn(tokenService, 'verify').mockResolvedValueOnce({ id: 1 } as any);
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({ id: 1 } as any);
    jest.spyOn(passwordService, 'hash').mockResolvedValueOnce('hashPassword');
    jest.spyOn(userRepository, 'update').mockImplementationOnce(model => Promise.resolve(model as any));

    const user = await service.resetPassword('token', 'newPassowrd');
    expect(user.password).toBe('hashPassword');
  });

  it('should throw NotFoundException when try to changePassword and user was not found', async () => {
    jest.spyOn(tokenService, 'verify').mockResolvedValueOnce({ id: 1 } as any);
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(null);

    try {
      await service.resetPassword('token', 'newPassowrd');
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });
});
