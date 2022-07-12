import { IUser } from '@/shared/types/IUser';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from '../account/account.service';
import { getRoleString } from '../account/funcs/getRoleString';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepo: Repository<User>,
    @Inject(forwardRef(() => AccountService))
    private readonly AccountService: AccountService,
  ) {}

  public save(user: User) {
    return this.UserRepo.save(user);
  }

  public findByUsername(username: string) {
    return this.UserRepo.findOneBy({ Login: username });
  }

  public findByVk(vkId: number) {
    return this.UserRepo.findOneBy({ VkId: vkId });
  }

  public getAccount(user: User) {
    return this.AccountService.findById(user.AccountId);
  }

  public serialize(userObj: User): IUser {
    return {
      id: userObj.Id,
      account_id: userObj.AccountId,
      username: userObj.ShowLogin ? userObj.Login : false,
      vk_id: userObj.ShowVk ? userObj.VkId : false,
      role: getRoleString(userObj.Role),
    };
  }

  public serializeMany(userArray: User[]): IUser[] {
    return userArray.map((val) => this.serialize(val));
  }

  public findByAccountId(acc_id: number) {
    return this.UserRepo.findOneBy({ AccountId: acc_id });
  }

  public findById(id: number) {
    return this.UserRepo.findOneBy({ Id: id });
  }

  public async getVkNames(user: User) {
    const { VkId } = user;
    const token =
      '69498dbe69498dbe69498dbed9693e8b8c6694969498dbe0913be01c2936dcc0b0365aa';
    const url = new URL('https://api.vk.com/method/users.get');
    url.searchParams.append('user_ids', VkId.toString());
    url.searchParams.append('access_token', token);
    url.searchParams.append('v', '5.131');
    url.searchParams.append('lang', 'deu');
    const data: {
      response: [{ id: number; first_name: string; last_name: string }];
    } = await fetch(url).then((res) => res.json());

    return {
      fullname: `${data.response[0].first_name} ${data.response[0].last_name}`,
      firstname: data.response[0].first_name,
      lastname: data.response[0].last_name,
    };
  }
}
