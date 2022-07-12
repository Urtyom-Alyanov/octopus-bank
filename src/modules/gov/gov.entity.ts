import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../account/account.entity';
import { Organization } from '../org/org.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'goverments' })
export class Gov {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  AccountId: number;
  @OneToOne(() => Account)
  @JoinColumn({ name: 'AccountId' })
  Account: Account;

  @Column()
  OnlyGov: boolean;

  @Column()
  UserId: number;
  @OneToOne(() => User, (u) => u.Gov)
  @JoinColumn({ name: 'UserId' })
  User: User;

  @Column()
  BankCode: string;

  @OneToMany(() => Organization, (o) => o.Gov)
  Orgs: Organization[];
}
