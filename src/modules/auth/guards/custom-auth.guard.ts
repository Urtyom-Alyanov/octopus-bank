import {
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
  applyDecorators,
  UnauthorizedException,
  CanActivate,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AccountType } from '../../account/account.entity';
import { INVALID_ACCOUNT } from '../../account/exceptions';
import { IAuthorized } from '../IAuthorized';

export interface PrivateFunc {
  (opts?: { onlyTypes?: AccountType[] }): <TFunction extends Function, Y>(
    target: object | TFunction,
    propertyKey?: string | symbol,
  ) => void;
}

const IS_PRIVATE_KEY = 'IS_PRIVATE';
const ONLY_TYPES_KEY = 'ONLY_TYPES';
export const Private: PrivateFunc = (opts) =>
  applyDecorators(
    SetMetadata(IS_PRIVATE_KEY, true),
    SetMetadata(ONLY_TYPES_KEY, opts?.onlyTypes),
  );

@Injectable()
export class CustomAuthGuard extends AuthGuard('custom') {
  constructor(
    @Inject(Reflector)
    private reflector: Reflector,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPrivate = this.reflector.getAllAndOverride<boolean>(
      IS_PRIVATE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!isPrivate) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

@Injectable()
export class AccountTypeGuard implements CanActivate {
  constructor(
    @Inject(Reflector)
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const onlyTypes =
      this.reflector.getAllAndOverride<AccountType[]>(ONLY_TYPES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];
    if (onlyTypes.length <= 0) return true;

    const req = context
      .switchToHttp()
      .getRequest<Request & { user: IAuthorized }>();
    const authorized: IAuthorized = req.user;

    if (onlyTypes.includes(authorized.Account.AccountType)) return true;
    throw new BadRequestException(INVALID_ACCOUNT);
  }
}
