import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCode } from './authcode/authcode.entity';
import { AuthCodeService } from './authcode/authcode.service';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { RefreshToken } from './token/refresh/refresh-token.entity';
import { Scope } from './scope/scope.entity';
import { ScopeService } from './scope/scope.service';
import { Token } from './token/token.entity';
import { TokenService } from './token/token.service';
import { ClientModule } from '../client/client.module';
import { AccountModule } from '../account/account.module';
import { UserModule } from '../user/user.module';
import { CustomStrategy } from './strategies/custom.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [OAuthController],
  providers: [
    OAuthService,
    AuthCodeService,
    TokenService,
    ScopeService,
    CustomStrategy,
  ],
  imports: [
    TypeOrmModule.forFeature([AuthCode, Token, Scope, RefreshToken]),
    ClientModule,
    AccountModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'custom' }),
  ],
  exports: [
    OAuthService,
    AuthCodeService,
    TokenService,
    ScopeService,
    CustomStrategy,
    PassportModule,
  ],
})
export class AuthModule {}
