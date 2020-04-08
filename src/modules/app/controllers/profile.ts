import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRequired, CurrentUser } from 'modules/common/guards/token';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { User } from 'modules/database/models/user';

import { UserRepository } from '../repositories/user';
import { UserService } from '../services/user';
import { UpdateValidator } from '../validators/profile/update';

@ApiTags('App: Profile')
@Controller('/profile')
@AuthRequired()
export class ProfileController {
  constructor(private userRepository: UserRepository, private userService: UserService) {}

  @Get()
  @ApiResponse({ status: 200, type: User })
  public async details(@CurrentUser() currentUser: ICurrentUser) {
    const user = this.userRepository.findById(currentUser.id);
    if (!user) throw new NotFoundException();

    return user;
  }

  @Post()
  @ApiResponse({ status: 200, type: User })
  public async update(@Body() model: UpdateValidator, @CurrentUser() currentUser: ICurrentUser) {
    return this.userService.update(model, currentUser);
  }
}
