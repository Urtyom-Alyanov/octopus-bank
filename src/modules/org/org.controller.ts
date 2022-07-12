import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AccountType } from '../account/account.entity';
import { CurrentAccountRelated } from '../auth/decorators/current-account.decorator';
import { Private } from '../auth/guards/custom-auth.guard';
import { Bank } from '../bank/bank.entity';
import { BankService } from '../bank/bank.service';
import { ManyOutput } from '../main/global/DTOs/ManyOutput';
import { User } from '../user/user.entity';
import { CreateOrgInput } from './DTO/CreateOrgInput';
import { CreateOrgOutput } from './DTO/CreateOrgOutput';
import { OrgOutput } from './DTO/OrgOutput';
import { INVALID_ORG_TYPE, REQUIRED_FEE } from './exceptions';
import { Organization, OrgType } from './org.entity';
import { OrgService } from './org.service';

@Controller({ version: '2.0a', path: '/methods/org' })
export class OrgController {
  constructor(
    @Inject(OrgService)
    private readonly OrgService: OrgService,
    @Inject(BankService)
    private readonly BankService: BankService,
  ) {}

  @Post('create')
  @Private({ onlyTypes: [AccountType.User] })
  async create(
    @Body() CreateOrgInput: CreateOrgInput,
    @CurrentAccountRelated() acc_related: User,
  ): Promise<CreateOrgOutput> {
    let org: Organization;
    let bank: Bank | null = null;
    switch (CreateOrgInput.org_type) {
      case 'bank':
        if (!CreateOrgInput.bank_fee)
          throw new BadRequestException(REQUIRED_FEE);
        org = await this.OrgService.create(
          acc_related,
          CreateOrgInput.gov_id,
          CreateOrgInput.is_gov_org,
          OrgType.Bank,
          CreateOrgInput.name,
          CreateOrgInput.tag,
        );
        bank = await this.BankService.create(org, CreateOrgInput.bank_fee);
        break;
      case 'org':
        org = await this.OrgService.create(
          acc_related,
          CreateOrgInput.gov_id,
          CreateOrgInput.is_gov_org,
          OrgType.Organization,
          CreateOrgInput.name,
          CreateOrgInput.tag,
        );
        break;
      default:
        throw new BadRequestException(INVALID_ORG_TYPE);
    }

    return {
      bank: await this.BankService.serialize(bank),
      org: await this.OrgService.serialize(org),
    };
  }

  @Get('from-gov/:govId')
  async getFromGov(
    @Param('govId', ParseIntPipe) gov_id: number,
    @Query() { limit, page }: { limit: number; page: number },
  ): Promise<ManyOutput<OrgOutput>> {
    const { items, opts } = await this.OrgService.findByGovId(
      gov_id,
      limit,
      page,
    );
    return this.OrgService.serializeMany(items, opts);
  }

  @Get('from-user/:userId')
  async getFromUser(
    @Param('userId', ParseIntPipe) user_id: number,
    @Query() { limit, page }: { limit: number; page: number },
  ): Promise<ManyOutput<OrgOutput>> {
    console.log(limit);
    console.log(page);
    const { items, opts } = await this.OrgService.findByUserId(
      user_id,
      limit,
      page,
    );
    return this.OrgService.serializeMany(items, opts);
  }

  @Get('from-id/:id')
  async getFromId(@Param('id') id: number): Promise<OrgOutput> {
    const org = await this.OrgService.findById(id);
    return this.OrgService.serialize(org);
  }
}
