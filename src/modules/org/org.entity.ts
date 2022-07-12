import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../account/account.entity';
import { Gov } from '../gov/gov.entity';
import { User } from '../user/user.entity';

export enum OrgType {
  Bank = 'Bank',
  Organization = 'Organization',
}

@Entity({ name: 'orgs' })
export class Organization {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  AccountId: number;
  @OneToOne(() => Account)
  @JoinColumn({ name: 'AccountId' })
  Account: Account;

  @Column({ enum: OrgType })
  Type: OrgType;

  @Column()
  UserId: number;
  @ManyToOne(() => User, (u) => u.Orgs)
  User: User;

  @Column()
  IsGovOrg: boolean;

  @Column()
  GovId: number;

  @ManyToOne(() => Gov, (g) => g.Orgs)
  @JoinColumn({ name: 'GovId' })
  Gov: Gov;
}
