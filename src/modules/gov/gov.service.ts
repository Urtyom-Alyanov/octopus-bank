import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountType } from '../account/account.entity';
import { AccountService } from '../account/account.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { GovOutput } from './DTO/GovOutput';
import { Gov } from './gov.entity';

function generateRandomIntegerInRange(min: number, max: number) {
  return Math.round(Math.floor(Math.random() * (max - min + 1)) + min);
}

@Injectable()
export class GovService implements OnModuleInit {
  constructor(
    @InjectRepository(Gov)
    private readonly GovRepo: Repository<Gov>,
    @Inject(forwardRef(() => UserService))
    private readonly UserService: UserService,
    @Inject(forwardRef(() => AccountService))
    private readonly AccountService: AccountService,
  ) {}

  public async onModuleInit() {
    await this.createFirst({
      name: 'Ловушкинск',
      only_gov: true,
      tag: 'falleland',
    });
  }

  public async serialize(govObj: Gov): Promise<GovOutput> {
    return {
      id: govObj.Id,
      account_id: govObj.AccountId,
      user_id: govObj.AccountId,
      card_code: govObj.BankCode,
      only_gov_org: govObj.OnlyGov,
    };
  }

  public findByID(id: number) {
    return this.GovRepo.findOneBy({ Id: id });
  }

  public findByAccountId(accid: number) {
    return this.GovRepo.findOneBy({ AccountId: accid });
  }

  public findByCardCode(card_code: string) {
    return this.GovRepo.findOneBy({ BankCode: card_code });
  }

  private async createFirst(data: {
    name: string;
    tag: string;
    only_gov: boolean;
  }) {
    const user = await this.UserService.findById(1);
    console.log(user);
    if (!user)
      return new Promise<Gov>((resolve, reject) => {
        setTimeout(() => resolve(this.createFirst(data)), 1000);
      });
    const accFindedByTag = await this.AccountService.findByTag(data.tag);
    if (accFindedByTag) {
      return this.findByAccountId(accFindedByTag.Id);
    }
    return this.create({ is_published: true, ...data }, user);
  }

  public async create(
    {
      name,
      tag,
      only_gov,
      is_published,
    }: { name: string; tag: string; only_gov: boolean; is_published?: boolean },
    user: User,
  ) {
    const genCode = async (): Promise<string> => {
      const bankCode = `${generateRandomIntegerInRange(
        0,
        9,
      )}${generateRandomIntegerInRange(0, 9)}`;
      const finded = await this.findByCardCode(bankCode);
      if (finded) return genCode();
      return bankCode;
    };
    const bank_code = await genCode();
    const account = await this.AccountService.create(
      AccountType.Goverment,
      name,
      tag,
      is_published || false,
    );
    const goverment = new Gov();

    goverment.Account = account;
    goverment.AccountId = account.Id;
    goverment.BankCode = bank_code;
    goverment.OnlyGov = only_gov;
    goverment.User = user;
    goverment.UserId = user.Id;

    return this.GovRepo.save(goverment);
  }

  public findByUser(user: Pick<User, 'Id'>) {
    return this.GovRepo.findOneBy({ UserId: user.Id });
  }
}
