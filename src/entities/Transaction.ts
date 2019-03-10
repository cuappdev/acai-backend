import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Base, { SerializedBase } from './Base';

export enum TransactionStatus {
  RECEIVED = 'received',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export type SerializedTransaction = SerializedBase & {
  status: string,
  total: number,
};

@Entity('transactions')
class Transaction extends Base {
  @Column()
  customerId: string;

  @Column({ unique: true })
  orderId: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.RECEIVED,
  })
  status: string;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  total: number;

  serialize(): SerializedTransaction {
    return {
      ...super.serialize(),
      status: this.status,
      total: this.total,
    };
  }
}

export default Transaction;
