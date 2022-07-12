import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Account } from '../../account/account.entity';
import { Client } from '../../client/client.entity';
import { RefreshToken } from './refresh/refresh-token.entity';
import { Scope } from '../scope/scope.entity';

export enum TokenType {
  Refresh = 'refresh',
  Access = 'access',
}

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryColumn()
  Token: string;

  @ManyToMany(() => Scope, (scope) => scope.Tokens)
  @JoinTable({ name: 'token-scopes' })
  Scopes: Scope[];

  @Column()
  ExpiresIn: number;

  @Column()
  RefreshExpiresIn: number;

  @Column()
  AccountId: number;

  @Column()
  ClientId: number;

  @ManyToOne(() => Client, (client) => client.Tokens, { cascade: true })
  @JoinColumn({ name: 'ClientId' })
  Client: Client;

  @OneToOne(() => RefreshToken, (refreshtoken) => refreshtoken.Token)
  RefreshToken: RefreshToken;

  @ManyToOne(() => Account, (account) => account.Tokens)
  @JoinColumn({ name: 'AccountId' })
  Account: Account;
}
