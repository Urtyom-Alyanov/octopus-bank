import {
  Body,
  Controller,
  Get,
  Inject,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseFilters,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Account } from '../../account/account.entity';
import { ClientService } from '../../client/client.service';
import { ImageService } from '../../image/image.service';
import { AuthCodeService } from '../authcode/authcode.service';
import { CurrentAccount } from '../decorators/current-account.decorator';
import { Private } from '../guards/custom-auth.guard';
import { OAuthService } from '../oauth.service';
import { RedirectUnauthorizedFilter } from '../exception-filters/redirect-unauthorized.filter';
import { ScopeService } from '../scope/scope.service';
import { TokenService } from '../token/token.service';

@Controller({
  path: 'oauth',
  version: VERSION_NEUTRAL,
})
export class OAuthFrontendController {
  constructor(
    @Inject(OAuthService)
    private OAuthService: OAuthService,
    @Inject(ScopeService)
    private ScopeService: ScopeService,
    @Inject(TokenService)
    private TokenService: TokenService,
    @Inject(AuthCodeService)
    private AuthCodeService: AuthCodeService,
    @Inject(ClientService)
    private ClientService: ClientService,
  ) {}

  @Get('authorize')
  @Private()
  @UseFilters(RedirectUnauthorizedFilter)
  @Render('oauth')
  public async AuthorizePage(
    @Query('client_id', new ParseIntPipe()) client_id: number,
    @Query('redirect_uri') redirect_uri: string,
    @Query('response_type') response_type: 'code' | 'token',
    @Query('scopes', new ParseArrayPipe({ items: String, separator: ',' }))
    scopes_unparsed: string[],
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @CurrentAccount() account: Account,
    @Query('state') state?: string | undefined,
  ) {
    const scopes = await this.ScopeService.ScopeParseFirstStep(scopes_unparsed);
    const client = await this.ClientService.getById(client_id);

    const IsValidPath = this.OAuthService.CheckClientRedirectHost(
      client_id,
      redirect_uri,
    );
    if (!IsValidPath)
      return this.OAuthService.ErrorRedirect(
        res,
        redirect_uri,
        'Неверный адрес переадерсации',
      );

    const acc_img_src = ImageService.getUrl(account.ImageId);
    const client_img_src = ImageService.getUrl(client.ClientImageId);

    return {
      response_type,
      scopes,
      client_name: client.ClientName,
      client_id,
      redirect_uri,
      acc_img_src,
      client_img_src,
      acc_name: account.Name,
      state,
    };
  }

  @Post('authorize/accept')
  public async AuthorizeAccept(
    @Body('scopes') scopes: string[],
    @Body('client_id') client_id: number,
    @Body('response_type') response_type: 'code' | 'token',
    @Body('redirect_uri') redirect_uri: string,

    @Res() res: Response,
    @Body('state') state?: string | undefined,
  ) {
    const Scopes = await this.ScopeService.ScopeParseSecondStep(scopes);
    let tokenOrCode: {
      token_or_code: string;
      expires_in: number;
      refresh_token?: string;
      refresh_expires_in?: number;
    } = {
      expires_in: 0,
      token_or_code: '',
      refresh_expires_in: 0,
      refresh_token: '',
    };
    if (response_type === 'code') {
      const code = await this.AuthCodeService.generate(client_id, 1, Scopes);
      tokenOrCode.token_or_code = code.code;
      tokenOrCode.expires_in = code.expires_in;
    } else {
      const token = await this.TokenService.generate(1, client_id, Scopes);
      tokenOrCode.token_or_code = token.token;
      tokenOrCode.refresh_token = token.refresh_token;
      tokenOrCode.refresh_expires_in = token.refresh_expires_in;
      tokenOrCode.expires_in = token.expires_in;
    }

    this.OAuthService.SetAutoAuthorizeCookie(res, client_id);

    return this.OAuthService.AuthorizeAcceptRedirect(
      res,
      redirect_uri,
      response_type === 'code' ? 'code' : 'token',
      tokenOrCode.token_or_code,
      tokenOrCode.expires_in,
      tokenOrCode.refresh_token,
      tokenOrCode.refresh_expires_in,
      state,
    );
  }

  @Post('authorize/deny')
  public async AuthorizeDeny(
    @Body('redirect_uri') redirect_uri: string,
    @Res() res: Response,
  ) {
    return this.OAuthService.AuthorizeDenyRedirect(res, redirect_uri);
  }

  @Get('register')
  @Render('register')
  public Create(
    @Query('vk_token') vk_token: string,
    @Query('oauth_data') oauth_data?: string,
  ) {
    return { oauth_data: oauth_data || null, vk_token: vk_token };
  }

  @Get('login')
  @Render('authpage')
  public Login(@Query('oauth_data') oauth_data: string) {
    return { oauth_data: oauth_data || null };
  }
}
