import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthCode } from '../auth/authcode/authcode.entity';
import { Token } from '../auth/token/token.entity';
import { User } from '../user/user.entity';
import { OAuthHostName } from './oauth-hostname.entity';

@Entity({ name: 'applications' })
export class Client {
  @PrimaryGeneratedColumn()
  ClientId: number;

  @Column()
  ClientName: string;

  @Column()
  ClientSecret: string;

  @Column({ nullable: true })
  ClientImageId?: number;

  @OneToMany(() => Token, (token) => token.Client)
  Tokens: Token[];

  @OneToMany(() => AuthCode, (code) => code.Client)
  Codes: AuthCode[];

  @OneToMany(() => OAuthHostName, (hostname) => hostname.Client, {
    eager: true,
  })
  Hostnames: OAuthHostName[];

  @Column()
  UserId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'UserId' })
  User: User;
}
