import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { Currency } from './currency.entity';
import { WalletTemplateService } from './wallet-template.service';
import { CurrencyService } from './currency.service';
import { WalletTemplate } from './wallet-template.entity';
import { BankModule } from '../bank/bank.module';
import { OrgModule } from '../org/org.module';
import { UserModule } from '../user/user.module';
import { AccountModule } from '../account/account.module';
import { CurrencyController } from './currency.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, WalletTemplate, Currency]),
    BankModule,
    OrgModule,
    UserModule,
    AccountModule,
  ],
  providers: [WalletService, CurrencyService, WalletTemplateService],
  controllers: [WalletController, CurrencyController],
  exports: [WalletService, CurrencyService, WalletTemplateService],
})
export class WalletModule {}
