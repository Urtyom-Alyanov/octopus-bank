import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountType } from '../account/account.entity';
import { AccountService } from '../account/account.service';
import { GovService } from '../gov/gov.service';
import { ManyOutput } from '../main/global/DTOs/ManyOutput';
import { ManyOpts } from '../main/global/DTOs/Opts';
import { WithManyOpts } from '../main/global/DTOs/WithOpts';
import { User } from '../user/user.entity';
import { OrgOutput } from './DTO/OrgOutput';
import { Organization, OrgType } from './org.entity';
import { getPaginatedResponseFromDBBy } from '../main/global/funcs/getPaginatedResponseFromDB';

@Injectable()
export class OrgService {
  constructor(
    @InjectRepository(Organization)
    private readonly OrgRepo: Repository<Organization>,
    @Inject(GovService)
    private readonly GovService: GovService,
    @Inject(forwardRef(() => AccountService))
    private readonly AccountService: AccountService,
  ) {}

  findById(id: number) {
    return this.OrgRepo.findOneBy({ Id: id });
  }

  async findByGovId(
    gov_id: number,
    limit: number,
    page: number,
  ): Promise<WithManyOpts<Organization>> {
    const [items, count] = await this.OrgRepo.findAndCount(
      getPaginatedResponseFromDBBy({ GovId: gov_id }, limit, page),
    );
    return { items, opts: { count, limit, page } };
  }

  async findByUserId(
    user_id: number,
    limit: number,
    page: number,
  ): Promise<WithManyOpts<Organization>> {
    const [items, count] = await this.OrgRepo.findAndCount(
      getPaginatedResponseFromDBBy({ UserId: user_id }, limit, page),
    );
    return { items, opts: { count, limit, page } };
  }

  getGov(org: Organization) {
    return this.GovService.findByID(org.GovId);
  }

  findByAccountId(accid: number) {
    return this.OrgRepo.findOneBy({ AccountId: accid });
  }

  async create(
    user: User,
    govId: number,
    isGovOrg: boolean,
    orgType: OrgType,
    name: string,
    tag: string,
  ) {
    const account = await this.AccountService.create(
      AccountType.Organization,
      name,
      tag,
    );

    const org = new Organization();

    org.Account = account;
    org.AccountId = account.Id;
    org.GovId = govId;
    org.UserId = user.Id;
    org.User = user;

    org.Type = orgType;
    org.IsGovOrg = isGovOrg;

    return this.OrgRepo.save(org);
  }

  async serialize(org: Organization): Promise<OrgOutput> {
    return {
      id: org.Id,
      acc_id: org.AccountId,
      user_id: org.UserId,
      gov_id: org.GovId,
      is_gov_org: org.IsGovOrg,
      org_type: org.Type === OrgType.Bank ? 'bank' : 'org',
    };
  }

  async serializeMany(
    orgs: Organization[],
    opts: ManyOpts,
  ): Promise<ManyOutput<OrgOutput>> {
    return {
      items: await Promise.all(orgs.map((org) => this.serialize(org))),
      count: opts.count,
      page: opts.page,
      limit: opts.limit,
    };
  }
}
