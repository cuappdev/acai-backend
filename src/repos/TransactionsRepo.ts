import { getConnectionManager, Repository } from 'typeorm';
import Transaction from '../entities/Transaction';

const db = (): Repository<Transaction> => getConnectionManager().get().getRepository(Transaction);

type CreateTransactionFields = {
  orderID: string,
  total: number,
};

const createTransaction = async (
  orderID: string,
  total: number,
): Promise<Transaction> => {
  try {
    const transaction = db().create({
      orderID,
      total,
    });
    await db().save(transaction);
    return transaction;
  } catch (e) {
    throw new Error('Unable to create transaction');
  }
};

export default {
  createTransaction,
};
