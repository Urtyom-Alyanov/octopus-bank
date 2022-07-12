import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { Private } from '../auth/guards/custom-auth.guard';
import { AccountService } from '../account/account.service';
import { CurrentAccount } from '../auth/decorators/current-account.decorator';
import { WalletTemplateService } from './wallet-template.service';
import { WalletService } from './wallet.service';
import { Account, AccountType } from '../account/account.entity';
import { User } from '../user/user.entity';
import { INVALID_ACCOUNT } from '../account/exceptions';
import { WalletOutputManyDTO } from './DTO/WalletOutputManyDTO';
import { WalletOutputDTO } from './DTO/WalletOutputDTO';

class CreateWallet {
  wtemplate_id: number;
}

@Controller({ path: 'methods/wallet', version: '2.0a' })
export class WalletController {
  constructor(
    @Inject(WalletService)
    private readonly WalletService: WalletService,
    @Inject(WalletTemplateService)
    private readonly WalletTemplateService: WalletTemplateService,
    @Inject(AccountService)
    private readonly AccountService: AccountService,
  ) {}

  @Post('create')
  @Private()
  async create(
    @Body() CreateWallet: CreateWallet,
    @CurrentAccount() Account: Account,
  ): Promise<WalletOutputDTO> {
    if (Account.AccountType !== AccountType.User)
      throw new BadRequestException(INVALID_ACCOUNT);
    const user = (await this.AccountService.findRelated(Account)) as User;
    const wallettemplate = await this.WalletTemplateService.findById(
      CreateWallet.wtemplate_id,
    );
    const wallet = await this.WalletService.createForUser(wallettemplate, user);

    return this.WalletService.serialize(wallet, wallettemplate);
  }

  @Get('my-wallets')
  @Private()
  async getMyWallets(
    @CurrentAccount() Account: Account,
  ): Promise<WalletOutputManyDTO> {
    const [wallets, count] = await this.WalletService.findWalletsByAccount(
      Account,
    );

    return {
      items: await this.WalletService.serializeMany(wallets),
      count,
    };
  }

  @Get('from-card-number/:cardNumber')
  async getFromCardNumber(
    @Param('cardNumber') CardNumber: string,
  ): Promise<WalletOutputDTO> {
    const wallet = await this.WalletService.findWalletByCardNumber(
      CardNumber.replaceAll('_', ' '),
    );

    return this.WalletService.serialize(wallet);
  }
}
