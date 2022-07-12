import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Account } from '../account/account.entity';
import { WalletTemplate } from './wallet-template.entity';

@Entity({ name: 'wallets' })
export class Wallet {
  @PrimaryColumn()
  CardNumber: string;

  @Column({ type: 'decimal' })
  Balance: number;

  @Column()
  OwnerName: string;

  @Column()
  WalletTemplateId: number;

  @ManyToOne(() => WalletTemplate, (wt) => wt.Wallets)
  @JoinColumn({ name: 'WalletTemplateId' })
  WalletTemplate: WalletTemplate;

  @Column()
  AccountId: number;

  @ManyToOne(() => Account, (a) => a.Wallets)
  @JoinColumn({ name: 'AccountId' })
  Account: Account;

  @Column()
  IsBlocked: boolean;
}
