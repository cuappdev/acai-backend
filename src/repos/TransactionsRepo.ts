import { getConnectionManager, Repository } from 'typeorm';
import Transaction from '../entities/Transaction';

const db = (): Repository<Transaction> => getConnectionManager().get().getRepository(Transaction);

type CreateTransactionFields = {
  customerId: string,
  orderId: string,
  total: number,
};

const createTransaction = async (
  fields: CreateTransactionFields,
): Promise<SerializedTransaction> => {
  try {
    const transaction = db().create(fields);
    await db().save(transaction);
    return transaction.serialize();
  } catch (e) {
    throw new Error('Unable to create transaction');
  }
};

export default {
  createTransaction,
};
