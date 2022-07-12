import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../account/account.entity';
import { BankService } from '../bank/bank.service';
import { OrgService } from '../org/org.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CurrencyService } from './currency.service';
import { IWalletOutputDTO } from './DTO/WalletOutputDTO';
import { CardType, WalletTemplate } from './wallet-template.entity';
import { WalletTemplateService } from './wallet-template.service';
import { Wallet } from './wallet.entity';

function generateRandomIntegerInRange(min: number, max: number) {
  return Math.round(Math.floor(Math.random() * (max - min + 1)) + min);
}

@Injectable()
export class WalletService {
  constructor(
    @Inject(CurrencyService)
    private readonly CurrencyService: CurrencyService,
    @InjectRepository(Wallet)
    private readonly WalletRepo: Repository<Wallet>,
    @Inject(BankService)
    private readonly BankService: BankService,
    @Inject(OrgService)
    private readonly OrgService: OrgService,
    @Inject(UserService)
    private readonly UserService: UserService,
    @Inject(WalletTemplateService)
    private readonly WalletTemplateService: WalletTemplateService,
  ) {}

  generateCardNumber(
    currencyCode: string,
    govCode: string,
    bankCode: string,
    cardType: CardType,
  ) {
    const randomDigitFirst = `${generateRandomIntegerInRange(
      0,
      9,
    )}${generateRandomIntegerInRange(0, 9)}`;
    const randomDigitSecond = `${generateRandomIntegerInRange(
      0,
      9,
    )}${generateRandomIntegerInRange(0, 9)}${generateRandomIntegerInRange(
      0,
      9,
    )}${generateRandomIntegerInRange(0, 9)}`;
    const code = `86${cardType.toString()} ${currencyCode}${govCode} ${bankCode}${randomDigitFirst} ${randomDigitSecond}`;

    return code;
  }

  findWalletsByAccount(account: Account) {
    return this.WalletRepo.findAndCountBy({
      IsBlocked: false,
      AccountId: account.Id,
    });
  }

  findWalletByCardNumber(cardNumber: string) {
    const card = this.WalletRepo.findOneBy({ CardNumber: cardNumber });
    return card;
  }

  async create(template: WalletTemplate, account: Account, ownername: string) {
    const currency = await this.CurrencyService.findByISO(template.CurrncyISO);
    const bank = await this.BankService.findByID(template.BankId);
    const gov = await this.OrgService.getGov(
      await this.BankService.getOrg(bank),
    );
    const generateCardNumber = () =>
      this.generateCardNumber(
        currency.WalletCode,
        gov.BankCode,
        bank.BankCode,
        CardType.Debit,
      );
    const generateUniqueNumber = async (): Promise<string> => {
      const generated = generateCardNumber();
      const finded = await this.findWalletByCardNumber(generated);
      if (finded) return generateUniqueNumber();
      return generated;
    };

    const generated = await generateUniqueNumber();
    const wallet = new Wallet();

    wallet.CardNumber = generated;
    wallet.Balance = 0.0;
    wallet.WalletTemplate = template;
    wallet.WalletTemplateId = template.Id;
    wallet.Account = account;
    wallet.AccountId = account.Id;
    wallet.OwnerName = ownername;

    const savedwallet = this.WalletRepo.save(wallet);

    return savedwallet;
  }

  async createForUser(template: WalletTemplate, user: User) {
    const account = await this.UserService.getAccount(user);
    const ownernames = await this.UserService.getVkNames(user);
    return this.create(template, account, ownernames.fullname.toUpperCase());
  }

  async createForUserRelated(
    template: WalletTemplate,
    account: Account,
    user: User,
  ) {
    const ownernames = await this.UserService.getVkNames(user);
    return this.create(template, account, ownernames.fullname.toUpperCase());
  }

  async serialize(
    wallet: Wallet,
    wallet_tempate?: WalletTemplate,
  ): Promise<IWalletOutputDTO> {
    const wtemplate =
      wallet_tempate ||
      (await this.WalletTemplateService.findById(wallet.WalletTemplateId));

    return {
      card_number: wallet.CardNumber,
      owner_name: wallet.OwnerName,
      balance: wallet.Balance,
      account_id: wallet.AccountId,
      template_id: wallet.WalletTemplateId,
      currency_iso_code: wtemplate.CurrncyISO,
      name: wtemplate.Name,
    };
  }

  async serializeMany(wallets: Wallet[]): Promise<IWalletOutputDTO[]> {
    return Promise.all(wallets.map((wallet) => this.serialize(wallet)));
  }
}
