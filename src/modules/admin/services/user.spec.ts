import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { MailService } from 'modules/common/services/mail';
import { PasswordService } from 'modules/common/services/password';
import { enRoles, IUser } from 'modules/database/interfaces/user';

import { UserRepository } from '../repositories/user';
import { UserService } from './user';

/* eslint-disable max-len */
describe('Admin/UserService', () => {
  let mailService: MailService;
  let userRepository: UserRepository;
  let passwordService: PasswordService;
  let service: UserService;

  const user: IUser = {
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'test@email.com',
    roles: [enRoles.user]
  };

  beforeEach(async () => {
    mailService = new MailService(null);
    userRepository = new UserRepository();
    passwordService = new PasswordService();

    service = new UserService(userRepository, passwordService, mailService);
  });

  it('should create a user', async () => {
    jest.spyOn(userRepository, 'isEmailAvailable').mockResolvedValueOnce(true);
    jest.spyOn(passwordService, 'generatePassword').mockResolvedValueOnce({ password: '123', hash: '123hash' });
    jest.spyOn(userRepository, 'insert').mockImplementationOnce(user => Promise.resolve({ ...user } as any));
    jest.spyOn(mailService, 'send').mockImplementationOnce((to, subject, template, data) => {
      expect(to).toBe('test@email.com');
      expect(subject).toBe('Bem Vindo!');
      expect(template).toBe('user-create');
      expect(data.password).toBe('123');
      return Promise.resolve(null);
    });

    const result = await service.save(user);

    expect(result).not.toBeFalsy();
    expect(result).toEqual(user);
  });

  it('should update a user', async () => {
    jest.spyOn(userRepository, 'isEmailAvailable').mockResolvedValueOnce(true);
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({ isSysAdmin: () => false } as any);
    jest.spyOn(userRepository, 'update').mockImplementationOnce(user => Promise.resolve({ ...user } as any));

    const result = await service.save({ id: 1, ...user });

    expect(result).not.toBeFalsy();
    delete result.isSysAdmin;
    expect(result).toEqual({ id: 1, ...user });
  });

  it('should throw ConflictException with message email-unavailable when try create a user with email duplicated', async () => {
    jest.spyOn(userRepository, 'isEmailAvailable').mockResolvedValueOnce(false);

    try {
      await service.save(user);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictException);
      expect(err.message.message).toBe('email-unavailable');
    }
  });

  it('should throw ConflictException with message email-unavailable when try update a user with email duplicated', async () => {
    jest.spyOn(userRepository, 'isEmailAvailable').mockResolvedValueOnce(false);

    try {
      await service.save({ id: 1, ...user });
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictException);
      expect(err.message.message).toBe('email-unavailable');
    }
  });

  it('should throw NotFoundException when try update a not found user', async () => {
    jest.spyOn(userRepository, 'isEmailAvailable').mockResolvedValueOnce(true);
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(null);

    try {
      await service.save({ id: 1, ...user });
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should throw BadRequestException with message not-allowed-to-change-sysAdmin when try update a sysAdmin user', async () => {
    jest.spyOn(userRepository, 'isEmailAvailable').mockResolvedValueOnce(true);
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({ isSysAdmin: () => true } as any);

    try {
      await service.save({ id: 1, ...user });
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toBe('not-allowed-to-change-sysAdmin');
    }
  });

  it('should throw BadRequestException with message invalid-roles when try save a user with a invalid role', async () => {
    jest.spyOn(userRepository, 'isEmailAvailable').mockResolvedValueOnce(true);
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({ isSysAdmin: () => true } as any);

    try {
      await service.save({ id: 1, ...user, roles: ['invalid'] as any });
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toBe('invalid-roles');
    }
  });

  it('should throw BadRequestException with message invalid-roles when try save a user with a sysAdmin role', async () => {
    jest.spyOn(userRepository, 'isEmailAvailable').mockResolvedValueOnce(true);
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({ isSysAdmin: () => true } as any);

    try {
      await service.save({ id: 1, ...user, roles: [enRoles.sysAdmin] as any });
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toBe('not-allowed-to-change-sysAdmin');
    }
  });

  it('should throw BadRequestException with message invalid-roles when try save a user with a sysAdmin role', async () => {
    jest.spyOn(userRepository, 'isEmailAvailable').mockResolvedValueOnce(true);
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({ isSysAdmin: () => true } as any);

    try {
      await service.save({ id: 1, ...user, roles: [] });
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toBe('roles-required');
    }
  });

  it('should remove a user', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({ id: 2, isSysAdmin: () => false } as any);
    jest.spyOn(userRepository, 'remove').mockResolvedValueOnce({ id: 2 } as any);

    await service.remove(2, { id: 1 } as any);
  });

  it('should throw BadRequestException with message not-allowed-remove-sysAdmin when try to remove a user with a sysAdmin role', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({ id: 2, isSysAdmin: () => true } as any);

    try {
      await service.remove(2, { id: 1 } as any);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toBe('not-allowed-remove-sysAdmin');
    }
  });

  it('should throw BadRequestException with message not-allowed-remove-current-user when try to remove the current user', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({ id: 2 } as any);

    try {
      await service.remove(2, { id: 2 } as any);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toBe('not-allowed-remove-current-user');
    }
  });

  it('should throw NotFoundException when try to remove a not found user', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(null);

    try {
      await service.remove(2, { id: 2 } as any);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });
});
