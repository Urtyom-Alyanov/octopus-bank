import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AccountType } from '../account/account.entity';
import { User } from './user.entity';
import { UserService } from './user.service';
import bcrypt from 'bcrypt';
import { AccountService } from '../account/account.service';

@Injectable()
export class UserProvider implements OnModuleInit {
  constructor(
    @Inject(UserService)
    private readonly UserService: UserService,
    @Inject(AccountService)
    private readonly AccountService: AccountService,
  ) {}

  public async onModuleInit() {
    await this.createFirst({
      name: 'Уртём Альянов',
      password: 'aK16253498',
      tag: 'urtyom_alyanov',
      username: 'Urtyom_Alyanov',
      vk_id: 578425189,
    });
  }

  private async createFirst({
    name,
    tag,
    username,
    password,
    vk_id,
  }: {
    name: string;
    tag: string;
    password: string;
    vk_id: number;
    username: string;
  }) {
    const findedByUsername = await this.UserService.findByUsername(username);
    if (findedByUsername)
      return {
        user: findedByUsername,
        account: await this.UserService.getAccount(findedByUsername),
      };
    const findedByVk = await this.UserService.findByVk(vk_id);
    if (findedByVk)
      return {
        user: findedByVk,
        account: await this.UserService.getAccount(findedByVk),
      };
    const findedByTag = await this.AccountService.findByTag(tag);
    if (findedByTag)
      return {
        user: await this.UserService.findByAccountId(findedByTag.Id),
        account: findedByTag,
      };

    const newacc = await this.AccountService.create(
      AccountType.User,
      name,
      tag,
      true,
    );

    const newuser = new User();
    newuser.Account = newacc;
    newuser.AccountId = newacc.Id;
    newuser.ShowLogin = false;
    newuser.Login = username;
    newuser.PasswordHash = await bcrypt.hash(password, 10);
    const user = await this.UserService.save(newuser);

    return { user, account: newacc };
  }
}
