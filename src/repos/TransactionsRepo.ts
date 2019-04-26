import { getConnectionManager, Repository } from 'typeorm';

import SquareAPI from '../common/SquareAPI';
import Transaction from '../entities/Transaction';

const db = (): Repository<Transaction> => getConnectionManager().get().getRepository(Transaction);

const createDbTransaction = async (
  customerID: string,
  orderID: string,
  total: number,
): Promise<Transaction> => {
  const transaction = db().create({
    customerID,
    orderID,
    total,
  });
  await db().save(transaction);
  return transaction;
};

const createTransactionNewCard = async (
  customerID: string,
  cardNonce: string,
  orderID: string,
  total: number,
): Promise<Transaction> => {
  try {
    await SquareAPI.chargeNewCard(customerID, cardNonce, orderID, total);
    return createDbTransaction(customerID, orderID, total);
  } catch (e) {
    throw Error('Unable to create transaction');
  }
};

export default {
  createTransactionNewCard,
};
