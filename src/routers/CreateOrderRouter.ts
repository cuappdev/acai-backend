import { Request } from 'express';

import ApplicationRouter from '../appdev/ApplicationRouter';
import SquareAPI from '../common/SquareAPI';
import { SerializedTransaction } from '../common/types';
import utils from '../common/utils';
import TransactionsRepo from '../repos/TransactionsRepo';
import UsersRepo from '../repos/UsersRepo';

class CreateOrderRouter extends ApplicationRouter<SerializedTransaction> {
  constructor() {
    super('POST');
  }

  getPath(): string {
    return '/orders/';
  }

  async content(req: Request): Promise<SerializedTransaction> {
    const { cardNonce, itemVariations, taxes } = req.body;
    const sessionToken = utils.extractAuthToken(req.get('Authorization'));
    const user = await UsersRepo.getUserBySessionToken(sessionToken);
    const squareOrder = await SquareAPI.createOrder(itemVariations, taxes);
    const transaction = await TransactionsRepo.createTransactionNewCard(
      user.customerID,
      cardNonce,
      squareOrder.order.id,
      squareOrder.order.total_money.amount,
    );
    return transaction.serialize();
  }
}

export default new CreateOrderRouter().router;
