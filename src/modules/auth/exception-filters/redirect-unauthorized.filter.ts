import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { TokenService } from '../token/token.service';

@Catch(UnauthorizedException)
export class RedirectUnauthorizedFilter implements ExceptionFilter {
  constructor(@Inject(TokenService) private TokenService: TokenService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const access_token = request.cookies['access_token'] as string | undefined;
    const refresh_token = request.cookies['refresh_token'] as
      | string
      | undefined;

    if (!access_token || !refresh_token)
      this.redirectToAuthPage(request, response, exception);
    const repsponseBody = exception.getResponse();

    if (
      typeof repsponseBody !== 'object' ||
      (repsponseBody as { errorCode?: number })?.errorCode !== 102
    )
      this.redirectToAuthPage(request, response, exception);

    const tokens = await this.TokenService.refresh(access_token, refresh_token);

    response
      .cookie('refresh_token', tokens.refresh_token, {
        expires: new Date(tokens.refresh_expires_in * 1000),
        httpOnly: true,
      })
      .cookie('access_token', tokens.token, {
        expires: new Date(tokens.refresh_expires_in * 1000),
        httpOnly: true,
      });

    return response.redirect(request.url);
  }

  redirectToAuthPage(
    request: Request,
    response: Response,
    exception: UnauthorizedException,
  ) {
    let urlparams: string;

    if (request.path === '/oauth/authorize') {
      const oauth_data = Buffer.from(
        JSON.stringify({
          ClientId: request.query['client_id'],
          RedirectURI: request.query['redirect_uri'],
          ResponseType: request.query['response_type'],
          Scopes: (request.query['scopes'] as string).split(','),
          State: request.query['state'],
        }),
        'utf-8',
      ).toString('base64');
      urlparams = `?oauth_data=${oauth_data}`;
    }

    return response
      .status(exception.getStatus())
      .redirect('/oauth/login' + urlparams);
  }
}
