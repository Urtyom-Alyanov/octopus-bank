import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManyOutput } from '../main/global/DTOs/ManyOutput';
import { ManyOpts } from '../main/global/DTOs/Opts';
import { WithManyOpts } from '../main/global/DTOs/WithOpts';
import {
  getPaginatedResponseFromDB,
  getPaginatedResponseFromDBBy,
} from '../main/global/funcs/getPaginatedResponseFromDB';
import { Currency } from './currency.entity';
import { CurrencyOutputDTO } from './DTO/CurrencyOutput';

function generateRandomIntegerInRange(min: number, max: number) {
  return Math.round(Math.floor(Math.random() * (max - min + 1)) + min);
}

@Injectable()
export class CurrencyService implements OnModuleInit {
  constructor(
    @InjectRepository(Currency)
    private CurrencyRepo: Repository<Currency>,
  ) {}

  async findOrCreate({
    id,
    isoCode,
    leuroInOne,
    name,
  }: {
    id?: number;
    isoCode: string;
    leuroInOne: number;
    name: string;
  }) {
    if (id) {
      const finded = await this.CurrencyRepo.findOneBy({ Id: id });
      if (finded) return finded;
    }
    const genCode = async (): Promise<string> => {
      const bankCode = `${generateRandomIntegerInRange(
        0,
        9,
      )}${generateRandomIntegerInRange(0, 9)}`;
      const finded = await this.findByBankCode(bankCode);
      if (finded) return genCode();
      return bankCode;
    };
    const newcurrency = this.CurrencyRepo.create({
      ISO_4217: isoCode.toUpperCase(),
      LeuroInOne: leuroInOne,
      Name: name,
      Id: id,
      WalletCode: await genCode(),
    });
    return this.CurrencyRepo.save(newcurrency);
  }

  findByBankCode(bank_code: string) {
    return this.CurrencyRepo.findOneBy({
      WalletCode: bank_code,
    });
  }

  serialize(currency: Currency): CurrencyOutputDTO {
    return {
      id: currency.Id,
      iso: currency.ISO_4217,
      exchange_rate_to_leuro: parseFloat(
        currency.LeuroInOne as unknown as string,
      ),
      name: currency.Name,
      bank_code: currency.WalletCode,
    };
  }

  serializeMany(
    currencies: Currency[],
    opts: ManyOpts,
  ): ManyOutput<CurrencyOutputDTO> {
    return {
      count: opts.count,
      limit: opts.limit,
      page: opts.page,
      items: currencies.map((currency) => this.serialize(currency)),
    };
  }

  async findByISO(iso: string) {
    const currency = await this.CurrencyRepo.findOneBy({
      ISO_4217: iso.toUpperCase(),
    });

    return currency;
  }

  async findMany(page: number, limit: number): Promise<WithManyOpts<Currency>> {
    const [items, count] = await this.CurrencyRepo.findAndCount(
      getPaginatedResponseFromDB(limit, page),
    );
    return {
      items,
      opts: {
        count,
        limit,
        page,
      },
    };
  }

  async onModuleInit() {
    await this.findOrCreate({
      id: 1,
      isoCode: 'FLC',
      leuroInOne: 1,
      name: 'Лёйро',
    });
  }
}
