import { Column, Entity } from 'typeorm';
import Base from './Base';

@Entity('transactions')
class Transaction extends Base {
  @Column({ unique: true })
  customerId: string;

  @Column({ unique: true })
  orderID: string;

  @Column()
  status: string;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  total: number;
}

export default Transaction;
