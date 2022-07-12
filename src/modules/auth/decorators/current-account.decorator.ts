import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Account } from '../../account/account.entity';
import { IAuthorized } from '../IAuthorized';

export const CurrentAccount = createParamDecorator(
  (data: keyof Account, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: IAuthorized }>();
    return data ? request.user?.Account[data] : request.user?.Account;
  },
);

export const CurrentAccountRelated = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: IAuthorized }>();
    return request.user?.Related;
  },
);
