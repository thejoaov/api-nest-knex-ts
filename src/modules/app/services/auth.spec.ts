import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PasswordService } from 'modules/common/services/password';
import { TokenService } from 'modules/common/services/token';

import { DeviceRepository } from '../repositories/device';
import { UserRepository } from '../repositories/user';
import { AuthService } from './auth';

describe('App/AuthService', () => {
  let tokenService: TokenService;
  let userRepository: UserRepository;
  let deviceRepository: DeviceRepository;
  let passwordService: PasswordService;
  let service: AuthService;

  beforeEach(async () => {
    tokenService = new TokenService();
    userRepository = new UserRepository();
    deviceRepository = new DeviceRepository();
    passwordService = new PasswordService();

    service = new AuthService(tokenService, userRepository, deviceRepository, passwordService);
  });

  it('should return tokens for a valid user when try to login', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({ password: 'password' } as any);
    jest.spyOn(passwordService, 'compare').mockResolvedValueOnce(true);
    jest.spyOn(tokenService, 'generateAccessToken').mockResolvedValueOnce('app_access_token');
    jest.spyOn(tokenService, 'generateRefreshToken').mockResolvedValueOnce('app_refresh_token');
    jest.spyOn(deviceRepository, 'findById').mockResolvedValueOnce(null);
    jest.spyOn(deviceRepository, 'insert').mockResolvedValueOnce(null);

    const result = await service.login({
      deviceId: 'deviceId',
      deviceName: 'deviceName',
      email: 'teste@email.com',
      notificationToken: 'notificationToken',
      password: 'password'
    });

    expect(result).not.toBeFalsy();
    expect(result.accessToken).toEqual('app_access_token');
    expect(result.refreshToken).toEqual('app_refresh_token');
  });

  it('should return update device when a valid user try to login', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({ password: 'password' } as any);
    jest.spyOn(passwordService, 'compare').mockResolvedValueOnce(true);
    jest.spyOn(tokenService, 'generateAccessToken').mockResolvedValueOnce('app_access_token');
    jest.spyOn(tokenService, 'generateRefreshToken').mockResolvedValueOnce('app_refresh_token');
    jest.spyOn(deviceRepository, 'findById').mockResolvedValueOnce({} as any);
    jest.spyOn(deviceRepository, 'update').mockResolvedValueOnce(null);

    const result = await service.login({
      deviceId: 'deviceId',
      deviceName: 'deviceName',
      email: 'teste@email.com',
      notificationToken: 'notificationToken',
      password: 'password'
    });

    expect(result).not.toBeFalsy();
    expect(result.accessToken).toEqual('app_access_token');
    expect(result.refreshToken).toEqual('app_refresh_token');
  });

  it('should throw NotFoundException when user was not found', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);

    try {
      await service.login({
        deviceId: 'deviceId',
        deviceName: 'deviceName',
        email: 'teste@email.com',
        notificationToken: 'notificationToken',
        password: 'password'
      });

      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should throw BadRequestException when password is invalid', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({ password: 'password' } as any);
    jest.spyOn(passwordService, 'compare').mockResolvedValueOnce(false);

    try {
      await service.login({
        deviceId: 'deviceId',
        deviceName: 'deviceName',
        email: 'teste@email.com',
        notificationToken: 'notificationToken',
        password: 'password'
      });

      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should remove device when user try to logout', async () => {
    jest.spyOn(deviceRepository, 'findById').mockResolvedValueOnce({ userId: 1 } as any);
    jest.spyOn(deviceRepository, 'remove').mockResolvedValueOnce(null);

    expect(service.logout({ id: 1 } as any, '1')).toResolve();
  });

  it('should throw NotFoundException when user try to logout and the device was not found', async () => {
    jest.spyOn(deviceRepository, 'findById').mockResolvedValueOnce(null);

    try {
      await service.logout({ id: 1 } as any, '1');

      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should throw BadRequestException when user try to logout and the user`s device is not the same', async () => {
    jest.spyOn(deviceRepository, 'findById').mockResolvedValueOnce({ userId: 2 } as any);

    try {
      await service.logout({ id: 1 } as any, '1');

      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });
});
