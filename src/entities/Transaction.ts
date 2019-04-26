import { Column, Entity, ManyToOne } from 'typeorm';
import { SerializedTransaction } from '../common/types';
import Base from './Base';
import User from './User';

export enum TransactionStatus {
  RECEIVED = 'received',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('transactions')
class Transaction extends Base {
  @Column()
  customerID: string;

  @Column({ unique: true })
  orderID: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.RECEIVED,
  })
  status: string;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  total: number;

  @ManyToOne(type => User, user => user.transactions)
  user: User;

  serialize(): SerializedTransaction {
    return {
      ...super.serialize(),
      orderID: this.orderID,
      status: this.status,
      total: this.total,
    };
  }
}

export default Transaction;
