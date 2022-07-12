import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../account/account.entity';
import { Gov } from '../gov/gov.entity';
import { Organization } from '../org/org.entity';

export enum Role {
  User = 'usr',
  Moderator = 'mod',
  Editor = 'edt',
  Administrator = 'adm',
  SuperUser = 'sus',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  AccountId: number;

  @OneToOne(() => Account, { cascade: true })
  @JoinColumn({ name: 'AccountId' })
  Account: Account;

  @Column({ unique: true })
  Login: string;

  @Column({ default: true })
  ShowLogin: boolean;

  @Column({ default: true })
  ShowVk: boolean;

  @Column({ unique: true })
  VkId: number;

  @Column()
  PasswordHash: string;

  @Column({ enum: Role, default: Role.User })
  Role: Role;

  @OneToMany(() => Organization, (o) => o.User)
  Orgs: Organization[];

  @OneToOne(() => Gov, (g) => g.User)
  Gov: Gov;
}
