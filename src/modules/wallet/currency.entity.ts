import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WalletTemplate } from './wallet-template.entity';

@Entity({ name: 'currencies' })
export class Currency {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ unique: true })
  Name: string;

  @Column({ length: 5, unique: true })
  ISO_4217: string;

  @Column({ type: 'decimal' })
  LeuroInOne: number;

  @Column({ unique: true })
  WalletCode: string;

  @OneToMany(() => WalletTemplate, (wt) => wt.Currency)
  WalletTemplates: WalletTemplate[];
}
