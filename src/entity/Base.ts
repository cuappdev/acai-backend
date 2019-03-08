import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
abstract class Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  customerId: string;
}

export default Base;
