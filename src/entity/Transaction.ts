import { Column, Entity } from 'typeorm';
import Base from './Base';

@Entity()
class Transaction extends Base {
  @Column({ type: 'text', unique: true })
  orderID: string;

  @Column({ type: 'text' })
  status: string;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  transactionAmount: number;
}

export default Transaction;
