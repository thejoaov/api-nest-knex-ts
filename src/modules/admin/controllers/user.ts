import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRequired, CurrentUser } from 'modules/common/guards/token';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { enRoles, listPublicRoles } from 'modules/database/interfaces/user';
import { User } from 'modules/database/models/user';

import { UserRepository } from '../repositories/user';
import { UserService } from '../services/user';
import { ListValidator } from '../validators/user/list';
import { SaveValidator } from '../validators/user/save';

@ApiTags('Admin: User')
@Controller('/user')
@AuthRequired([enRoles.admin])
export class UserController {
  constructor(private userRepository: UserRepository, private userService: UserService) {}

  @Get()
  @ApiResponse({ status: 200, type: [User] })
  public async list(@Query() model: ListValidator) {
    return this.userRepository.list(model);
  }

  @Get('roles')
  @ApiResponse({ status: 200, type: 'string', isArray: true })
  public async roles() {
    const roles = listPublicRoles();
    const rolesDescriptions: any = {
      admin: { name: 'Administrador', description: 'Acesso total a todas as funcionalidades' },
      user: { name: 'Usuário', description: 'Accesso Limitado' }
    };

    return roles.map(role => ({ role, ...rolesDescriptions[role] })).filter(role => role);
  }

  @Get(':userId')
  @ApiResponse({ status: 200, type: User })
  public async details(@Param('userId', ParseIntPipe) userId: number) {
    return this.userRepository.findById(userId);
  }

  @Delete(':userId')
  public async delete(@Param('userId', ParseIntPipe) userId: number, @CurrentUser() currentUser: ICurrentUser) {
    return this.userService.remove(userId, currentUser);
  }

  @Post()
  @ApiResponse({ status: 200, type: User })
  public async save(@Body() model: SaveValidator) {
    return this.userService.save(model);
  }
}
