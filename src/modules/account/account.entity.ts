import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Token } from '../auth/token/token.entity';
import { Image } from '../image/image.entity';
import { Wallet } from '../wallet/wallet.entity';

export enum AccountType {
  Organization,
  Goverment,
  User,
}

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Tag: string;

  @Column()
  Name: string;

  @Column({
    nullable: true,
  })
  Description: string;

  @OneToMany(() => Token, (token) => token.Account)
  Tokens: Token[];

  @Column({ nullable: true })
  ImageId: number;

  @OneToOne(() => Image, { nullable: true })
  @JoinColumn({ name: 'ImageId' })
  Image: Image;

  @OneToMany(() => Wallet, (w) => w.Account)
  Wallets: Wallet[];

  @Column({ enum: AccountType, default: AccountType.User })
  AccountType: AccountType;

  @Column({ default: false })
  IsPublished: boolean;
}
