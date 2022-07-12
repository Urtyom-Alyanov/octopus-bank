import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCode } from './authcode.entity';
import { randomBytes } from 'crypto';
import { ClientService } from '../../client/client.service';
import { TokenService } from '../token/token.service';
import { Scope } from '../scope/scope.entity';

const getUnixTime = () => {
  return Math.floor(Date.now() / 1000);
};

@Injectable()
export class AuthCodeService {
  constructor(
    @InjectRepository(AuthCode)
    private AuthCodeRepo: Repository<AuthCode>,
    @Inject(ClientService)
    private ClientService: ClientService,
    @Inject(TokenService)
    private TokenService: TokenService,
  ) {}

  public async generate(client_id: number, user_id: number, Scopes: Scope[]) {
    const authcode = new AuthCode();

    authcode.Code = randomBytes(20).toString('hex');
    authcode.ClientId = client_id;
    authcode.UserId = user_id;
    authcode.Scopes = Scopes;
    authcode.ExpiresIn = getUnixTime() + 60 * 60;

    const savedAuthCode = await this.AuthCodeRepo.save(authcode);

    return {
      code: savedAuthCode.Code,
      expires_in: authcode.ExpiresIn,
    };
  }

  public async swapToToken(
    client_id: number,
    client_secret: string,
    code: string,
  ) {
    const authcode = await this.AuthCodeRepo.findOne({
      where: { Code: code, ClientId: client_id },
      relations: { Scopes: true },
    });
    if (!authcode)
      throw new UnauthorizedException({
        errorCode: 104,
        errorText: 'Код авторизации не найден',
      });

    if (authcode.ExpiresIn < getUnixTime())
      throw new UnauthorizedException({
        errorCode: 104,
        errorText: 'Код авторизации просрочен',
      });

    const client = await this.ClientService.getByIdAndSecret(
      client_id,
      client_secret,
    );
    if (!client)
      throw new UnauthorizedException({
        errorCode: 105,
        errorText: 'Клиент не найден',
      });

    const tokenPair = await this.TokenService.generate(
      authcode.UserId,
      authcode.ClientId,
      authcode.Scopes,
    );
    await this.AuthCodeRepo.delete({ Code: code });

    return tokenPair;
  }
}
