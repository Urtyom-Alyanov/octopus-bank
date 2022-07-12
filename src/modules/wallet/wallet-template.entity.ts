import { Bank } from '@/modules/bank/bank.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Currency } from './currency.entity';
import { Wallet } from './wallet.entity';

export enum CardType {
  Debit = '79',
}

@Entity({ name: 'w-templates' })
export class WalletTemplate {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Name: string;

  @Column({ enum: CardType, default: CardType.Debit })
  CardType: CardType;

  @OneToMany(() => Wallet, (w) => w.WalletTemplate)
  Wallets: Wallet[];

  @ManyToOne(() => Currency, (c) => c.WalletTemplates)
  @JoinColumn({ name: 'CurrencyISO', referencedColumnName: 'ISO_4217' })
  Currency: Currency;
  @Column()
  CurrncyISO: string;

  @ManyToOne(() => Bank, (b) => b.WalletTemplates)
  @JoinColumn({ name: 'BankId' })
  Bank: Bank;
  @Column()
  BankId: number;
}
