import { IAccount } from './IAccount';
import { IOAuthQueryData } from './IOAuthQueryData';
import { IRedirect } from './IRedirect';
import { IUser } from './IUser';

export interface IRegisterOrLoginResponse {
  Redirect: IRedirect<IOAuthQueryData>;
  Account: IAccount;
  User: IUser;
}
