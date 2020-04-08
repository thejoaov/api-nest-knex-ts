import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequired, CurrentUser } from 'modules/common/guards/token';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';

import { AuthService } from '../services/auth';
import { LoginValidator } from '../validators/auth/login';
import { LogoutValidator } from '../validators/auth/logout';
import { OpenedValidator } from '../validators/auth/opened';
import { RefreshValidator } from '../validators/auth/refresh';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  public async login(@Body() model: LoginValidator) {
    return this.authService.login(model);
  }

  @Post('/logout')
  @AuthRequired()
  public async logout(@Body() model: LogoutValidator, @CurrentUser() currentToken: ICurrentUser) {
    await this.authService.logout(currentToken, model.deviceId);
    return { success: true };
  }

  @Post('/refresh')
  public async refresh(@Body() model: RefreshValidator) {
    return {
      accessToken: await this.authService.refreshToken(model.refreshToken, model.deviceId),
      refreshToken: model.refreshToken
    };
  }

  @Post('/opened')
  public async opened(@Body() model: OpenedValidator, @CurrentUser() currentToken: ICurrentUser) {
    await this.authService.updateSession(
      currentToken ? currentToken.id : null,
      model.deviceId,
      model.notificationToken
    );
    return { success: true };
  }
}
