import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { PasswordService } from 'modules/common/services/password';
import { enTokenType, TokenService } from 'modules/common/services/token';
import { IDevice } from 'modules/database/interfaces/device';
import { Device } from 'modules/database/models/device';
import uuid from 'uuid/v4';

import { DeviceRepository } from '../repositories/device';
import { UserRepository } from '../repositories/user';
import { LoginValidator } from '../validators/auth/login';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private userRepository: UserRepository,
    private deviceRepository: DeviceRepository,
    private passwordService: PasswordService
  ) {}

  public async login(model: LoginValidator): Promise<{ accessToken: String; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(model.email);
    if (!user) throw new NotFoundException();

    const isValid = await this.passwordService.compare(user.password, model.password);
    if (!isValid) throw new BadRequestException();

    const token = uuid();

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(user, true),
      this.tokenService.generateRefreshToken(user.id, model.deviceId, token)
    ]);

    await this.saveDevice({
      id: model.deviceId,
      name: model.deviceName,
      notificationToken: model.notificationToken,
      currentToken: token,
      userId: user.id
    });

    return { accessToken, refreshToken };
  }

  public async logout(currentUser: ICurrentUser, deviceId: string) {
    const device = await this.deviceRepository.findById(deviceId);

    if (!device) throw new NotFoundException('device-not-found');
    if (device.userId !== currentUser.id) throw new BadRequestException('invalid-user');

    await this.deviceRepository.remove(deviceId);
  }

  public async refreshToken(refreshToken: string, deviceId: string) {
    const tokenData = await this.tokenService.verify(refreshToken, enTokenType.refreshToken);
    if (tokenData.deviceId !== deviceId) throw new BadRequestException('invalid-device');

    const device = await this.deviceRepository.findById(tokenData.deviceId);

    if (!device) throw new NotFoundException('device-not-found');
    if (tokenData.uuid !== device.currentToken) throw new BadRequestException('invalid-device');

    const user = await this.userRepository.findById(tokenData.userId);
    if (!user) throw new NotFoundException('user-not-found');

    return this.tokenService.generateAccessToken(user, true);
  }

  public async updateSession(userId: number, deviceId: string, notificationToken: string) {
    const device = await this.deviceRepository.findById(deviceId);

    if (!device) {
      throw new ForbiddenException('invalid-session');
    }

    if (userId && device.userId !== userId) {
      throw new ForbiddenException('invalid-session');
    }

    if (!userId && device) {
      return this.deviceRepository.remove(deviceId);
    }

    this.deviceRepository.update({ ...device, notificationToken });
  }

  private async saveDevice(model: IDevice): Promise<Device> {
    const device = await this.deviceRepository.findById(model.id);

    if (device) {
      return this.deviceRepository.update({ ...device, ...model });
    }

    return this.deviceRepository.insert(model);
  }
}
