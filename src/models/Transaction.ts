import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: string;

  @Column()
  orderID: string;

  @Column()
  transactionAmount: number;

  @Column()
  status: string;
}

export default Transaction;
