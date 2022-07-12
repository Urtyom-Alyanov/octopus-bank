import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';

@Entity({ name: 'client-hostnames' })
export class OAuthHostName {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  HostName: string;

  @ManyToOne(() => Client, (c) => c.Hostnames)
  @JoinColumn({ name: 'ClientId' })
  Client: Client;

  @Column()
  ClientId: number;
}
