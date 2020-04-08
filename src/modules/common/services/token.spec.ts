import { BadRequestException } from '@nestjs/common';
import { enRoles, IUser } from 'modules/database/interfaces/user';

import { enTokenType, TokenService } from './token';

describe('Admin/TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    service = new TokenService();
  });

  const user: IUser = {
    id: 1,
    email: 'test@email.com',
    firstName: 'test',
    lastName: 'test',
    roles: [enRoles.admin]
  };

  it('should generate an accessToken for web', async () => {
    const token = await service.generateAccessToken(user, false);
    expect(typeof token).toBe('string');

    const result = await service.verify(token, enTokenType.accessToken);
    expect(result.id).toEqual(user.id);
    expect(result.firstName).toEqual(user.firstName);
    expect(result.lastName).toEqual(user.lastName);
    expect(result.email).toEqual(user.email);
    expect(result.roles).toEqual(user.roles);
  });

  it('should generate an accessToken for app', async () => {
    const token = await service.generateAccessToken(user, true);
    expect(typeof token).toBe('string');

    const result = await service.verify(token, enTokenType.accessToken);
    expect(result.id).toEqual(user.id);
    expect(result.firstName).toEqual(user.firstName);
    expect(result.lastName).toEqual(user.lastName);
    expect(result.email).toEqual(user.email);
    expect(result.roles).toEqual(user.roles);
  });

  it('should verify method reject when send an invalid accessToken', async () => {
    try {
      await service.verify('invalid', enTokenType.accessToken);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toEqual('token-invalid');
    }
  });

  it('should verify method reject when type is different', async () => {
    try {
      const token = await service.generateAccessToken(user);
      expect(token).toBeString();

      await service.verify(token, enTokenType.refreshToken);
      return fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toEqual('token-type-not-match');
    }
  });

  it('should verify method reject when token is expired', async () => {
    try {
      const token = await service.generateAccessToken(user, false, -30);
      expect(token).toBeString();

      await service.verify(token, enTokenType.accessToken);
      return fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toEqual('token-expired');
    }
  });

  it('should generate refresh token', async () => {
    const token = await service.generateRefreshToken(1, '1', '1');
    expect(token).toBeString();

    return expect(service.verify(token, enTokenType.refreshToken)).toResolve();
  });

  it('should renew access token', async () => {
    const token = await service.renewAccessToken({
      id: 1,
      firstName: 'Daniel',
      lastName: 'Prado',
      email: 'danielprado.ad@gmail.com',
      roles: [enRoles.sysAdmin]
    });
    expect(token).toBeString();

    return expect(service.verify(token, enTokenType.accessToken)).toResolve();
  });

  it('should renew access token', async () => {
    const token = await service.resetPassword({
      id: 1,
      firstName: 'Daniel',
      lastName: 'Prado',
      email: 'danielprado.ad@gmail.com',
      roles: [enRoles.sysAdmin]
    });
    expect(token).toBeString();

    return expect(service.verify(token, enTokenType.resetPassword)).toResolve();
  });
});
