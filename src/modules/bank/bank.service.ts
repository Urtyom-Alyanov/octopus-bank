import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../org/org.entity';
import { OrgService } from '../org/org.service';
import { Bank } from './bank.entity';
import { BankOutput } from './DTO/BankOutput';

function generateRandomIntegerInRange(min: number, max: number) {
  return Math.round(Math.floor(Math.random() * (max - min + 1)) + min);
}

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private readonly BankRepo: Repository<Bank>,
    @Inject(OrgService)
    private readonly OrgService: OrgService,
  ) {}

  async getOrg(bank: Bank) {
    return this.OrgService.findById(bank.OrgId);
  }

  async getByCode(code: string) {
    return this.BankRepo.findOneBy({ BankCode: code });
  }

  async create(org: Organization, fee: number) {
    const genCode = async (): Promise<string> => {
      const bankCode = `${generateRandomIntegerInRange(
        0,
        9,
      )}${generateRandomIntegerInRange(0, 9)}`;
      const finded = await this.getByCode(bankCode);
      if (finded) return genCode();
      return bankCode;
    };

    const bankCode = await genCode();
    const bank = new Bank();

    bank.BankCode = bankCode;
    bank.Org = org;
    bank.OrgId = org.Id;
    bank.BankFee = fee;

    return this.BankRepo.save(bank);
  }

  findByID(id: number) {
    return this.BankRepo.findOneBy({ Id: id });
  }

  async serialize(bank: Bank): Promise<BankOutput> {
    return {
      id: bank.Id,
      org_id: bank.OrgId,
      fee: bank.BankFee,
      card_code: bank.BankCode,
    };
  }
}
