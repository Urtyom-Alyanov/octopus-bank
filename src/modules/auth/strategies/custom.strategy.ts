import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { TokenService } from '../token/token.service';
import { AccountService } from '../../account/account.service';
import { IAuthorized } from '../IAuthorized';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy, 'custom') {
  constructor(
    @Inject(TokenService)
    private TokenService: TokenService,
    @Inject(AccountService)
    private AccountService: AccountService,
  ) {
    super();
  }

  async validate(request: Request): Promise<IAuthorized> {
    const tokenValid = await this.TokenService.validate(
      request.cookies['access_token'] ||
        request.query['access_token'] ||
        request.body['access_token'],
    );
    const tokenData = await this.TokenService.getTokenData(tokenValid);
    const Related = await this.AccountService.findRelated(tokenData.Account);
    return { ...tokenData, Related };
  }
}
