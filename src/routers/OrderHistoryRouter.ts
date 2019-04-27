import { Request } from 'express';
import UsersRepo from '../repos/UsersRepo';

import ApplicationRouter from '../appdev/ApplicationRouter';
import SquareAPI from '../common/SquareAPI';
import utils from '../common/utils';

class OrderHistoryRouter extends ApplicationRouter<any> {
  constructor() {
    super('GET');
  }

  getPath(): string {
    return '/orders/';
  }

  async content(req: Request): Promise<Object> {
    const sessionToken = utils.extractAuthToken(req.get('Authorization'));
    const user = await UsersRepo.getUserBySessionToken(sessionToken);
    const transactions = await UsersRepo.getTransactionsById(user.id);
    const orderIDs = transactions.reduce<string[]>(
      (ids, transaction) => ids.concat([transaction.orderID]),
      [],
    );
    const orders = (await SquareAPI.fetchOrders(orderIDs)).orders;
    return { orders };
  }
}

export default new OrderHistoryRouter().router;
