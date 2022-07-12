import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';

@Injectable()
export class OAuthService {
  public CheckClientRedirectHost(client_id: number, redirect_uri: string) {
    const RedirectTo = new URL(redirect_uri);

    return true;
  }

  public ErrorRedirect(res: Response, redirect_uri: string, error: string) {
    const RedirectTo = new URL(redirect_uri);
    RedirectTo.searchParams.append('status', 'error');
    RedirectTo.searchParams.append('error', error);

    return res.redirect(RedirectTo.toString());
  }

  public SetAutoAuthorizeCookie(res: Response, client_id: number) {
    return res.cookie('AUTHENTIFICATED__' + client_id, 'true');
  }

  public IsAutoAuthorize(req: Request, client_id: number) {
    return req.cookies['AUTHENTIFICATED__' + client_id] === 'true';
  }

  public AuthorizeAcceptRedirect(
    res: Response,
    redirect_uri: string,
    response_type: string,
    tokenOrCode: string,
    expiresIn: number,
    refresh_token?: string,
    refresh_expiresIn?: number,
    state?: string,
  ) {
    const RedirectTo = new URL(redirect_uri);

    RedirectTo.searchParams.append('status', 'accepted');
    RedirectTo.searchParams.append('expires_in', expiresIn.toString());
    RedirectTo.searchParams.append(
      response_type === 'code' ? 'code' : 'access_token',
      tokenOrCode,
    );
    if (refresh_token)
      RedirectTo.searchParams.append('refresh_token', refresh_token);
    if (refresh_expiresIn)
      RedirectTo.searchParams.append(
        'refresh_expires_in',
        refresh_expiresIn.toString(),
      );
    if (state) RedirectTo.searchParams.append('state', state);

    return res.redirect(RedirectTo.toString());
  }

  public AuthorizeDenyRedirect(res: Response, redirect_uri: string) {
    const RedirectTo = new URL(redirect_uri);

    RedirectTo.searchParams.append('status', 'denied');

    return res.redirect(RedirectTo.toString());
  }
}
