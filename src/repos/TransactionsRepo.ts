import { getConnectionManager, Repository } from 'typeorm';

import SquareAPI from '../common/SquareAPI';
import Transaction from '../entities/Transaction';

const db = (): Repository<Transaction> => getConnectionManager().get().getRepository(Transaction);

const createDBTransaction = async (
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
    return createDBTransaction(customerID, orderID, total);
  } catch (e) {
    throw Error('Unable to create transaction');
  }
};

const deleteTransactionByID = async (id: string) => {
  try {
    const transaction = await db().findOne({ id });
    await db().remove(transaction);
  } catch (e) {
    throw Error('Unable to delete transaction');
  }
};

export default {
  createDBTransaction,
  createTransactionNewCard,
  deleteTransactionByID,
};
