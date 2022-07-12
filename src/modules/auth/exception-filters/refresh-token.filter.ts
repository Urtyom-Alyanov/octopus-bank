import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TokenService } from '../token/token.service';

@Catch(UnauthorizedException)
export class RefreshTokenFilter implements ExceptionFilter {
  constructor(@Inject(TokenService) private TokenService: TokenService) {}

  async catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const access_token = request.cookies['access_token'] as string | undefined;
    const refresh_token = request.cookies['refresh_token'] as
      | string
      | undefined;

    if (!access_token || !refresh_token) throw exception;
    const repsponseBody = exception.getResponse();

    if (
      typeof repsponseBody !== 'object' ||
      (repsponseBody as { errorCode?: number })?.errorCode !== 102
    )
      throw exception;

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
}
