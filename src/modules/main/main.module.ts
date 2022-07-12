import { DynamicModule, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCode } from '../auth/authcode/authcode.entity';
import { Client } from '../client/client.entity';
import { Token } from '../auth/token/token.entity';
import { Scope } from '../auth/scope/scope.entity';
import { User } from '../user/user.entity';
import { Account } from '../account/account.entity';
import { RefreshToken } from '../auth/token/refresh/refresh-token.entity';
import { OAuthFrontendModule } from '../auth/frontend/oauth-frontend.module';
import { AccountModule } from '../account/account.module';
import { UserModule } from '../user/user.module';
import { Image } from '../image/image.entity';
import { ImageModule } from '../image/image.module';
import {
  AccountTypeGuard,
  CustomAuthGuard,
} from '../auth/guards/custom-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { WalletModule } from '../wallet/wallet.module';
import { GovModule } from '../gov/gov.module';
import { BankModule } from '../bank/bank.module';
import { OrgModule } from '../org/org.module';
import { Gov } from '../gov/gov.entity';

@Module({})
export class MainModule {
  public static initialize(): DynamicModule {
    return {
      module: MainModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          database: 'pbm_api',
          entities: [
            AuthCode,
            Client,
            Token,
            Scope,
            User,
            Account,
            RefreshToken,
            Image,
            Gov,
          ],
          synchronize: true,
          autoLoadEntities: true,
          keepConnectionAlive: true,
          host: '127.0.0.1',
          password: 'pbm-chlen',
          username: 'pbm-chlen',
          port: 5432,
        }),
        AuthModule,
        OAuthFrontendModule.initialize(),
        AccountModule,
        UserModule,
        GovModule,
        OrgModule,
        BankModule,
        ImageModule,
        WalletModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: CustomAuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: AccountTypeGuard,
        },
      ],
    };
  }
}
