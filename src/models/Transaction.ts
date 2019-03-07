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
  status: string;

  @Column()
  transactionAmount: number;
}

export default Transaction;
