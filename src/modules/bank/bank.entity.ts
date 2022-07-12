import { Organization } from '@/modules/org/org.entity';
import { WalletTemplate } from '@/modules/wallet/wallet-template.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'banks' })
export class Bank {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  OrgId: number;
  @JoinColumn({ name: 'OrgId' })
  Org: Organization;

  @Column()
  BankCode: string;

  @Column({ type: 'decimal' })
  BankFee: number;

  @OneToMany(() => WalletTemplate, (wt) => wt.Bank)
  WalletTemplates: WalletTemplate[];
}
