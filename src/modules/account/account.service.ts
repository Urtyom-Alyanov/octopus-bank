import { IAccount } from '@/shared/types/IAccount';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageService } from '../image/image.service';
import { Account, AccountType } from './account.entity';
import { ICropData } from '@/shared/types/ICropData';
import { UserService } from '../user/user.service';
import { OrgService } from '../org/org.service';
import { GovService } from '../gov/gov.service';
import { User } from '../user/user.entity';
import { Organization } from '../org/org.entity';
import { Gov } from '../gov/gov.entity';
import { getRoleLevel } from './funcs/getRoleLevel';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly AccountRepo: Repository<Account>,
    @Inject(ImageService)
    private readonly ImageService: ImageService,
    @Inject(forwardRef(() => UserService))
    private readonly UserService: UserService,
    @Inject(forwardRef(() => OrgService))
    private readonly OrgService: OrgService,
    @Inject(forwardRef(() => GovService))
    private readonly GovService: GovService,
  ) {}

  public findById(id: number) {
    return this.AccountRepo.findOneBy({ Id: id });
  }

  public findByTag(tag: string) {
    if (tag.startsWith('id') && parseInt(tag.split('id')[1]))
      return this.findById(parseInt(tag.split('id')[1]));
    return this.AccountRepo.findOneBy({ Tag: tag });
  }

  public save(acc: Account) {
    return this.AccountRepo.save(acc);
  }

  public create(
    accountType: AccountType,
    name: string,
    tag: string,
    is_published?: boolean,
  ) {
    const account = new Account();

    account.Name = name;
    account.AccountType = accountType;
    account.Tag = tag;
    account.IsPublished = is_published || false;

    return this.save(account);
  }

  public editDesc(account: Account, desc: string) {
    account.Description = desc;

    return this.save(account);
  }

  public editTag(account: Account, tag: string) {
    account.Tag = tag;

    return this.save(account);
  }

  public editName(account: Account, name: string) {
    account.Name = name;

    return this.save(account);
  }

  public async uploadAvatar(
    file: Buffer,
    account: Account,
    ICropData: ICropData,
  ) {
    if (!account) return null;
    if (account.ImageId) await this.ImageService.deleteFromId(account.ImageId);
    const imageId = await this.ImageService.uploadAndCrop({
      buffer: file,
      isAvatar: true,
      ...ICropData,
    });
    account.ImageId = imageId;
    const savedAccount = await this.save(account);
    return savedAccount;
  }

  public serialize(accObj: Account): IAccount {
    return {
      id: accObj.Id,
      name: accObj.Name,
      tag: accObj.Tag,
      description: accObj.Description,
      image_src: ImageService.getUrl(accObj.ImageId),
      acc_type:
        accObj.AccountType === AccountType.Goverment
          ? 'goverment'
          : accObj.AccountType === AccountType.Organization
          ? 'organization'
          : accObj.AccountType === AccountType.User
          ? 'user'
          : null,
    };
  }

  public async serializeRelated(
    accType: AccountType,
    related: Gov | Organization | User,
  ) {
    return accType === AccountType.User
      ? this.UserService.serialize(related as User)
      : accType === AccountType.Goverment
      ? this.GovService.serialize(related as Gov)
      : accType === AccountType.Organization
      ? this.OrgService.serialize(related as Organization)
      : null;
  }

  public serializeMany(accArray: Account[]): IAccount[] {
    return accArray.map((val) => this.serialize(val));
  }

  public async findRelated(account: Pick<Account, 'Id' | 'AccountType'>) {
    return account.AccountType === AccountType.User
      ? this.UserService.findByAccountId(account.Id)
      : account.AccountType === AccountType.Organization
      ? this.OrgService.findByAccountId(account.Id)
      : account.AccountType === AccountType.Goverment
      ? this.GovService.findByAccountId(account.Id)
      : null;
  }

  /**
   * validateScope
   */
  public async validateScope(
    validateAcc: Pick<Account, 'Id' | 'AccountType'>,
    validatorAcc: Pick<Account, 'Id' | 'AccountType'>,
  ): Promise<boolean> {
    if (validateAcc.Id === validatorAcc.Id) return true;
    if (
      validateAcc.AccountType !== AccountType.User &&
      validatorAcc.AccountType === AccountType.User
    ) {
      const userValidator: User = (await this.findRelated(
        validatorAcc,
      )) as User;
      const relatedValidate: Gov | Organization = (await this.findRelated(
        validatorAcc,
      )) as Gov | Organization;

      if (relatedValidate.UserId === userValidator.Id) return true;
      if (getRoleLevel(userValidator.Role) > 2) return true;
    }
    return false;
  }
}
