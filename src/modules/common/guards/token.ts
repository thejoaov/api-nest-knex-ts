import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UseGuards
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiBearerAuth } from '@nestjs/swagger';
import { enRoles } from 'modules/database/interfaces/user';

import { ICurrentUser } from '../interfaces/currentUser';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user: ICurrentUser = request.user;

    if (!user) {
      return false;
    }

    const roles =
      this.reflector.get<enRoles[]>('roles', context.getHandler()) ||
      this.reflector.get<enRoles[]>('roles', context.getClass());

    if (!roles || !roles.length) {
      return true;
    }

    return [...roles, enRoles.sysAdmin, enRoles.sysAdmin].some(role => user.roles.includes(role));
  }
}

export const CurrentUser = createParamDecorator((data, request: any) => {
  return request.user;
});

export const AuthRequired = (roles?: enRoles[]) => (target: any, key?: string, descriptor?: any) => {
  SetMetadata('roles', roles || [])(target, key, descriptor);
  UseGuards(TokenGuard)(target, key, descriptor);
  ApiBearerAuth()(target, key, descriptor);
};
