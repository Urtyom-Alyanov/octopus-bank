import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Client } from '../../client/client.entity';
import { Scope } from '../scope/scope.entity';

@Entity({ name: 'authorization-codes' })
export class AuthCode {
  @PrimaryColumn()
  Code: string;

  @Column()
  UserId: number;

  @Column()
  ClientId: number;

  @ManyToOne(() => Client, (client) => client.Codes, { cascade: true })
  @JoinColumn({ name: 'ClientId' })
  Client: Client;

  @ManyToMany(() => Scope, (scope) => scope.Codes)
  @JoinTable({ name: 'authcode-scopes' })
  Scopes: Scope[];

  @Column()
  ExpiresIn: number;
}
