import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'images' })
export class Image {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'bytea' })
  Data: Uint8Array;

  @Column()
  ContentType: string;
}
