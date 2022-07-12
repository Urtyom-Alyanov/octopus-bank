import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository, Not } from 'typeorm';
import { INVALID_REFRESH_TOKEN, TOKEN_EXPIRED_NO_REFRESH } from '../exceptions';
import { RefreshToken } from './refresh/refresh-token.entity';
import { Scope } from '../scope/scope.entity';
import { Token } from './token.entity';

const getUnixTime = () => {
  return Math.floor(Date.now() / 1000);
};

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private TokenRepo: Repository<Token>,

    @InjectRepository(RefreshToken)
    private RefreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async generate(account_id: number, client_id: number, scopes: Scope[]) {
    const token = new Token();
    const refreshToken = new RefreshToken();

    token.Token = randomBytes(36).toString('hex');
    token.ClientId = client_id;
    token.AccountId = account_id;
    token.ExpiresIn = getUnixTime() + 60 * 30;
    token.Scopes = scopes;

    const refreshExpires = getUnixTime() + 60 * 60 * 24 * 30;

    refreshToken.RefreshToken = randomBytes(36).toString('hex');
    refreshToken.ExpiresIn = refreshExpires;
    refreshToken.AccessToken = token.Token;

    token.RefreshExpiresIn = refreshExpires;

    const savedToken = await this.TokenRepo.save(token);

    refreshToken.Token = token;

    const savedRefreshToken = await this.RefreshTokenRepo.save(refreshToken);

    return {
      token: savedToken.Token,
      refresh_token: savedRefreshToken.RefreshToken,
      expires_in: savedToken.ExpiresIn,
      refresh_expires_in: savedRefreshToken.ExpiresIn,
    };
  }

  async validate(token: string) {
    const tokenObj = await this.TokenRepo.findOneBy({ Token: token });

    if (!tokenObj)
      throw new UnauthorizedException({
        errorCode: 103,
        errorText: 'Токена не существует',
      });

    if (tokenObj.ExpiresIn < getUnixTime()) {
      if (tokenObj.RefreshExpiresIn < getUnixTime()) {
        await this.TokenRepo.delete({ Token: tokenObj.Token });
        throw new UnauthorizedException({
          errorCode: 101,
          errorText: 'Токен просрочен без возможности перезапустить сессию',
        });
      }
      throw new UnauthorizedException({
        errorCode: 102,
        errorText: 'Токен просрочен, перезапустите сессию',
      });
    }

    return tokenObj.Token;
  }

  async getTokenData(token: string) {
    return this.TokenRepo.findOne({
      where: { Token: token },
      relations: { RefreshToken: true, Account: true, Scopes: true },
    });
  }

  async getRefreshTokenData(token: string) {
    return this.RefreshTokenRepo.findOne({
      where: { RefreshToken: token },
      relations: { Token: true },
    });
  }

  async revoke(token: string): Promise<'ok'> {
    const tokenObj = await this.TokenRepo.findOneBy({ Token: token });
    const refreshTokenObj = await this.RefreshTokenRepo.findOneBy({
      AccessToken: token,
    });

    await this.RefreshTokenRepo.delete({ RefreshToken: refreshTokenObj.RefreshToken });
    await this.TokenRepo.delete({ Token: tokenObj.Token });

    return 'ok';
  }

  async findAllTokenFromAccount(account_id: number) {
    return this.TokenRepo.findBy({ AccountId: account_id });
  }

  async revokeAll__Account(token: string): Promise<'ok'> {
    const tokenObj = await this.TokenRepo.findOneBy({ Token: token });

    await this.TokenRepo.delete({
      AccountId: tokenObj.AccountId,
      Token: Not(token),
    });

    return 'ok';
  }

  async revokeAll__Client(client_id: number): Promise<'ok'> {
    await this.TokenRepo.delete({
      ClientId: client_id,
    });

    return 'ok';
  }

  async refresh(access_token: string, refresh_token: string) {
    const refreshTokenData = await this.getRefreshTokenData(refresh_token);
    if (refreshTokenData.AccessToken !== access_token)
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    const tokenData = await this.getTokenData(access_token);
    if (tokenData.RefreshExpiresIn < getUnixTime()) {
      await this.TokenRepo.delete({ Token: tokenData.Token });
      throw new UnauthorizedException(TOKEN_EXPIRED_NO_REFRESH);
    }
    const newtokens = await this.generate(
      tokenData.AccountId,
      tokenData.ClientId,
      tokenData.Scopes,
    );
    this.revoke(tokenData.Token);

    return newtokens;
  }
}
