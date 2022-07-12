import { IRegisterOrLoginResponse } from '@/shared/types/IRegisterResponse';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AccountService } from '../account/account.service';
import { JsonBase64Pipe } from './pipes/jsonbase64.pipe';
import { ScopeService } from './scope/scope.service';
import { TokenService } from './token/token.service';
import { UserService } from '../user/user.service';
import bcrypt from 'bcrypt';
import { Account } from '../account/account.entity';
import { User } from '../user/user.entity';
import { IRegisterBody } from '@/shared/types/RegisterBody';
import { INVALID_PASSWORD_OR_LOGIN, PASSWORDS_NOT_MATCH } from './exceptions';
import { IsString } from 'class-validator';
import { ILoginBody } from '@/shared/types/ILoginBody';
import { OAuthVkRedirect } from '@/shared/consts/oauth_vk_redirect';
import { OAuthVkClientId } from '@/shared/consts/oauth_vk_client_id';
import { OAuthVkClientSecret } from '@/shared/consts/oauth_vk_client_secret';
import { AuthCodeService } from './authcode/authcode.service';

class RegisterBody implements IRegisterBody {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  account_name: string;

  @IsString()
  vk_token: string;

  @IsString()
  account_tag: string;

  oauth_data: string | null;

  @IsString()
  check_password: string;
}

interface IGenDataTokenCode {
  grant_type: 'authorization_code';
  code: string;
  client_secret: string;
  client_id: string;
}

interface IGenDataTokenRefresh {
  grant_type: 'refresh_token';
  refresh_token: string;
  access_token: string;
  client_secret: string;
  client_id: string;
}

type TGenDataToken = IGenDataTokenRefresh | IGenDataTokenCode;

class LoginBody implements ILoginBody {
  oauth_data: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}

interface OAuthData {
  Scopes: string[];
  ClientId: number;
  ResponseType: 'code' | 'token';
  RedirectURI: string;
  State?: string;
}

@Controller({
  path: 'oauth',
  version: '2.0a',
})
export class OAuthController {
  constructor(
    @Inject(ScopeService)
    private readonly ScopeService: ScopeService,
    @Inject(TokenService)
    private readonly TokenService: TokenService,
    @Inject(AccountService)
    private readonly AccountService: AccountService,
    @Inject(UserService)
    private readonly UserService: UserService,
    @Inject(AuthCodeService)
    private readonly AuthCodeService: AuthCodeService,
  ) {}

  @Post('register')
  @Version(VERSION_NEUTRAL)
  public async PostCreate(
    @Body() RegisterBody: RegisterBody,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IRegisterOrLoginResponse> {
    console.log(RegisterBody);
    if (RegisterBody.password !== RegisterBody.check_password)
      throw new UnauthorizedException(PASSWORDS_NOT_MATCH);
    const newacc = new Account();

    newacc.Tag = RegisterBody.account_tag;
    newacc.Name = RegisterBody.account_name;
    newacc.Description =
      '## Всем привет, я новенький в НБМ!\n\n* спотти сидит за ноутбуком *';

    const account = await this.AccountService.save(newacc);

    const vkApiUrl = new URL('https://api.vk.com/method/users.get');

    vkApiUrl.searchParams.append('access_token', RegisterBody.vk_token);
    vkApiUrl.searchParams.append('v', '5.131');
    vkApiUrl.searchParams.append('fields', 'domain');

    const oauth_data: OAuthData = RegisterBody.oauth_data
      ? new JsonBase64Pipe().transform(RegisterBody.oauth_data)
      : {
          ClientId: 1,
          RedirectURI: 'http://192.168.0.67:3000/',
          ResponseType: 'code',
          Scopes: ['refresh'],
        };

    const data: {
      response: [{ id: number }];
    } = await fetch(vkApiUrl).then((res) => res.json());

    const newuser = new User();
    newuser.Account = account;
    newuser.VkId = data.response[0].id;
    newuser.AccountId = account.Id;
    newuser.Login = RegisterBody.username;
    newuser.PasswordHash = bcrypt.hashSync(RegisterBody.password, 10);

    const user = await this.UserService.save(newuser);

    const tokens = await this.TokenService.generate(
      account.Id,
      1,
      await this.ScopeService.findScopes('any'),
    );

    res
      .cookie('refresh_token', tokens.refresh_token, {
        expires: new Date(tokens.refresh_expires_in * 1000),
        httpOnly: true,
      })
      .cookie('access_token', tokens.token, {
        expires: new Date(tokens.refresh_expires_in * 1000),
        httpOnly: true,
      });

    return {
      Account: this.AccountService.serialize(account),
      Redirect: {
        QueryData: {
          client_id: oauth_data.ClientId,
          redirect_uri: oauth_data.RedirectURI,
          scopes: oauth_data.Scopes,
          response_type: oauth_data.ResponseType,
          state: oauth_data.State,
        },
        RedirectURI: '',
      },
      User: this.UserService.serialize(user),
    };
  }

  @Post('login')
  @Version(VERSION_NEUTRAL)
  public async PostLogin(
    @Body() LoginBody: LoginBody,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IRegisterOrLoginResponse> {
    const user = await this.UserService.findByUsername(LoginBody.username);
    const oauth_data: OAuthData = LoginBody.oauth_data
      ? new JsonBase64Pipe().transform(LoginBody.oauth_data)
      : {
          ClientId: 1,
          RedirectURI: 'http://192.168.0.67:3000/',
          ResponseType: 'code',
          Scopes: ['refresh'],
        };
    if (!user || !bcrypt.compareSync(LoginBody.password, user.PasswordHash))
      throw new UnauthorizedException(INVALID_PASSWORD_OR_LOGIN);

    const account = await this.UserService.getAccount(user);
    const tokens = await this.TokenService.generate(
      account.Id,
      1,
      await this.ScopeService.findScopes('any'),
    );

    res
      .cookie('refresh_token', tokens.refresh_token, {
        expires: new Date(tokens.refresh_expires_in * 1000),
        httpOnly: true,
      })
      .cookie('access_token', tokens.token, {
        expires: new Date(tokens.refresh_expires_in * 1000),
        httpOnly: true,
      });
    return {
      Account: this.AccountService.serialize(account),
      Redirect: {
        QueryData: {
          client_id: oauth_data.ClientId,
          redirect_uri: oauth_data.RedirectURI,
          scopes: oauth_data.Scopes,
          response_type: oauth_data.ResponseType,
          state: oauth_data.State,
        },
        RedirectURI: '',
      },
      User: this.UserService.serialize(user),
    };
  }

  @Get('vk-auth-redirect')
  public async VkAuthRedirect(
    @Query('code') code: string,
    @Query('state') state_unparsed: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const OAuthHost = new URL('https://oauth.vk.com/access_token');

    OAuthHost.searchParams.append('client_id', OAuthVkClientId.toString());
    OAuthHost.searchParams.append('client_secret', OAuthVkClientSecret);
    OAuthHost.searchParams.append('redirect_uri', OAuthVkRedirect);
    OAuthHost.searchParams.append('code', code);

    const state = state_unparsed
      ? new JsonBase64Pipe().transform(state_unparsed)
      : null;

    const data: {
      access_token: string;
      expires_in: number;
      user_id: number;
    } = await fetch(OAuthHost).then((res) => res.json());

    const vkApiUrl = new URL('https://api.vk.com/method/users.get');

    vkApiUrl.searchParams.append('access_token', data.access_token);
    vkApiUrl.searchParams.append('v', '5.131');
    vkApiUrl.searchParams.append('fields', 'domain');

    const dataUser: {
      response: [{ id: number }];
    } = await fetch(vkApiUrl).then((res) => res.json());

    const user = await this.UserService.findByVk(dataUser.response[0].id);
    const oauthData = state || {
      ClientId: 1,
      RedirectURI: 'http://192.168.0.67:3000/',
      ResponseType: 'code',
      Scopes: ['refresh'],
    };
    if (!user) {
      const vk_token = data.access_token;
      const oauthdataencoded = Buffer.from(
        JSON.stringify(oauthData),
        'utf-8',
      ).toString('base64');

      return res.redirect(
        `/oauth/register?vk_token=${vk_token}&oauth_data=${oauthdataencoded}`,
      );
    }
    const account = await this.UserService.getAccount(user);
    const tokens = await this.TokenService.generate(
      account.Id,
      1,
      await this.ScopeService.findScopes('any'),
    );

    res
      .cookie('refresh_token', tokens.refresh_token, {
        expires: new Date(tokens.refresh_expires_in * 1000),
        httpOnly: true,
      })
      .cookie('access_token', tokens.token, {
        expires: new Date(tokens.refresh_expires_in * 1000),
        httpOnly: true,
      });

    return res.redirect(
      `/oauth/authorize?client_id=${oauthData.ClientId}&redirect_uri=${
        oauthData.RedirectURI
      }&response_type=${oauthData.ResponseType}&scopes=${oauthData.Scopes.join(
        ',',
      )}`,
    );
  }

  @Post('refresh')
  public async Refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const tokens = await this.TokenService.refresh(
      req.cookies['access_token'],
      req.cookies['refresh_token'],
    );

    res
      .cookie('refresh_token', tokens.refresh_token, {
        expires: new Date(tokens.refresh_expires_in * 1000),
        httpOnly: true,
      })
      .cookie('access_token', tokens.token, {
        expires: new Date(tokens.refresh_expires_in * 1000),
        httpOnly: true,
      });
    return { response: 'ok' };
  }

  @Post('token')
  public async TokenPath(@Body() GenTokenData: TGenDataToken) {
    let tokens: {
      refresh_token: string;
      refresh_expires_in: number;
      access_token: string;
      access_expires_in: number;
    } = {
      access_expires_in: 0,
      access_token: '',
      refresh_expires_in: 0,
      refresh_token: '',
    };

    switch (GenTokenData.grant_type) {
      case 'authorization_code':
        const __tokens_authcode = await this.AuthCodeService.swapToToken(
          parseInt(GenTokenData.client_id),
          GenTokenData.client_secret,
          GenTokenData.code,
        );
        tokens = {
          access_expires_in: __tokens_authcode.expires_in,
          access_token: __tokens_authcode.token,
          refresh_expires_in: __tokens_authcode.refresh_expires_in,
          refresh_token: __tokens_authcode.refresh_token,
        };
        break;
      case 'refresh_token':
        const __tokens = await this.TokenService.refresh(
          GenTokenData.access_token,
          GenTokenData.refresh_token,
        );
        tokens = {
          access_expires_in: __tokens.expires_in,
          access_token: __tokens.token,
          refresh_expires_in: __tokens.refresh_expires_in,
          refresh_token: __tokens.refresh_token,
        };
        break;
    }

    return tokens;
  }
}
