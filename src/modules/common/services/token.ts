import { BadRequestException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import cloneDeep from 'lodash/cloneDeep';
import { IUser } from 'modules/database/interfaces/user';
import { AUTH } from 'settings';

import { ICurrentUser } from '../interfaces/currentUser';
import { IRefreshToken } from '../interfaces/refreshToken';
import { IResetPasswordToken } from '../interfaces/resetPassword';

export enum enTokenType {
  accessToken = 0,
  resetPassword = 1,
  refreshToken = 2
}

@Injectable()
export class TokenService {
  public async generateAccessToken(user: IUser, forApp: boolean = false, timeout?: number): Promise<string> {
    const tokenData: ICurrentUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles
    };

    return this.sign(tokenData, enTokenType.accessToken, timeout || (forApp ? AUTH.appTimeout : AUTH.timeout));
  }

  public async generateRefreshToken(userId: number, deviceId: string, uuid: string): Promise<string> {
    const tokenData: IRefreshToken = { userId, deviceId, uuid };
    return this.sign(tokenData, enTokenType.refreshToken);
  }

  public async renewAccessToken(userToken: ICurrentUser): Promise<string> {
    userToken = cloneDeep(userToken);
    return this.sign(userToken, enTokenType.accessToken, AUTH.timeout);
  }

  public async resetPassword(user: IUser): Promise<string> {
    const tokenData: IResetPasswordToken = {
      id: user.id,
      firstName: user.firstName,
      email: user.email
    };

    return this.sign(tokenData, enTokenType.resetPassword, AUTH.resetPasswordTimeout);
  }

  public async verify<T>(token: string, type: enTokenType.resetPassword): Promise<IResetPasswordToken>;
  public async verify<T>(token: string, type: enTokenType.refreshToken): Promise<IRefreshToken>;
  public async verify<T>(token: string, type: enTokenType.accessToken): Promise<ICurrentUser>;
  public async verify<T>(token: string, type: enTokenType): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      jwt.verify(token, AUTH.secret, (err: any, decoded: any) => {
        if (err || !decoded || decoded.type !== type) {
          return reject(this.resolveVerifyError(err));
        }

        resolve(decoded);
      });
    });
  }

  private async sign(tokenData: any, type: enTokenType, expiration: number = null): Promise<string> {
    return new Promise<string>(resolve => {
      (<any>tokenData).type = type;

      if (expiration) {
        (<any>tokenData).exp = this.expirationDate(expiration);
      }

      resolve(jwt.sign(tokenData, AUTH.secret));
    });
  }

  private expirationDate(minutes: number): number {
    return Math.floor(Date.now() / 1000) + minutes * 60;
  }

  private resolveVerifyError(err: Error): Error {
    if (!err) {
      return new BadRequestException('token-type-not-match');
    }

    switch (err.name) {
      case 'TokenExpiredError':
        return new BadRequestException('token-expired');
      default:
        return new BadRequestException('token-invalid');
    }
  }
}
