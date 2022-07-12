import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Token } from '../token.entity';

@Entity({ name: 'refresh-tokens' })
export class RefreshToken {
  @PrimaryColumn()
  RefreshToken: string;

  @OneToOne(() => Token, (token) => token.RefreshToken, { cascade: true })
  @JoinColumn({ name: 'AccessToken' })
  Token: Token;

  @Column()
  AccessToken: string;

  @Column()
  ExpiresIn: number;
}
