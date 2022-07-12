import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller({ path: 'methods/user', version: '2.0a' })
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly UserService: UserService,
  ) {}

  @Get('/find/:id')
  public async findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.UserService.serialize(await this.UserService.findById(id));
  }

  @Get('/find/:id/vk-names')
  public async findVkNameUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.UserService.findById(id);
    return this.UserService.getVkNames(user);
  }
}
