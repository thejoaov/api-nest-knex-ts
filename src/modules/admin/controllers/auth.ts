import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequired, CurrentUser } from 'modules/common/guards/token';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';

import { AuthService } from '../services/auth';
import { ChangePasswordValidator } from '../validators/auth/changePassword';
import { LoginValidator } from '../validators/auth/login';
import { ResetPasswordValidator } from '../validators/auth/resetPassword';
import { SendResetValidator } from '../validators/auth/sendReset';

@ApiTags('Admin: Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(@Body() model: LoginValidator) {
    return this.authService.login(model.email, model.password);
  }

  @Post('send-reset')
  public async sendReset(@Body() model: SendResetValidator) {
    return this.authService.sendResetPassword(model.email);
  }

  @Post('reset-password')
  public async resetPassword(@Body() model: ResetPasswordValidator) {
    return this.authService.resetPassword(model.token, model.password);
  }

  @Post('change-password')
  @AuthRequired()
  public async changePassword(@Body() model: ChangePasswordValidator, @CurrentUser() currentUser: ICurrentUser) {
    return this.authService.changePassword(currentUser, model.currentPassword, model.newPassword);
  }
}
