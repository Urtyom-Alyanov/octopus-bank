import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { AuthCode } from '../authcode/authcode.entity';
import { Token } from '../token/token.entity';

@Entity({ name: 'scopes' })
export class Scope {
  @PrimaryColumn()
  Name: string;

  @ManyToMany(() => Token, (token) => token.Scopes)
  Tokens: Token[];

  @ManyToMany(() => AuthCode, (code) => code.Scopes)
  Codes: AuthCode[];
}
