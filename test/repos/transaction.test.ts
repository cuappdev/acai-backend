import DBConnection from '../../src/db/DBConnection';
import Transaction, { TransactionStatus } from '../../src/entities/Transaction';
import User from '../../src/entities/User';
import TransactionsRepo from '../../src/repos/TransactionsRepo';
import UsersRepo from '../../src/repos/UsersRepo';

let user: User;
let transaction: Transaction;

// Connects to db before running tests and does setup
beforeAll(async () => {
  await DBConnection().catch((e) => {
    // eslint-disable-next-line no-console
    console.log('Error connecting to database');
    process.exit();
  });
  user = await UsersRepo.createUser('test@gmail.com', 'password', 'First', 'Last',
                                    '(213) 373-4253');
});

test('Create Transaction', async () => {
  transaction = await TransactionsRepo.createDBTransaction(user.customerID, '1', 20);
  expect(transaction.customerID).toBe(user.customerID);
  expect(transaction.orderID).toBe('1');
  expect(transaction.total).toBe(20);
  expect(transaction.status).toBe(TransactionStatus.RECEIVED);
});

// Teardown
afterAll(async () => {
  await TransactionsRepo.deleteTransactionByID(transaction.id);
  await UsersRepo.deleteUserByID(user.id);
});
