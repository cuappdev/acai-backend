import bodyParser from 'body-parser';
import crypto from 'crypto';
import express, { Response } from 'express';
import 'reflect-metadata';
import squareConnect from 'square-connect';
import { createConnection } from 'typeorm';

const defaultClient = squareConnect.ApiClient.instance;
const locationsApi = new squareConnect.LocationsApi();
const oauth2 = defaultClient.authentications['oauth2'];
const ordersApi = new squareConnect.OrdersApi();
const transactionsApi = new squareConnect.TransactionsApi();

oauth2.accessToken = process.env.ACCESS_TOKEN;

createConnection().then(async (connection: any) => {
  /*
    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);
  */
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  interface Error {
    status?: number;
    response?: Res;
  }

  interface Res {
    text?: string;
  }

  function handleTransactionError(error: Error, response: Response) {
    const { status, response: { text } } = error;
    const { errors } = JSON.parse(text);
    const messages = JSON.stringify(errors, null, 2);
    console.log(`[Error] Status: ${status}, Messages: ${messages}`);

    let errorMessage: string;
    switch (errors[0].code) {
      case 'CARD_DECLINED':
        errorMessage = 'Card declined. Please re-enter card information.';
        break;
      case 'VERIFY_CVV_FAILURE':
        errorMessage = 'Invalid CVV. Please re-enter card information.';
        break;
      case 'VERIFY_AVS_FAILURE':
        errorMessage = 'Invalid Postal Code. Please re-enter card information.';
        break;
      case 'INVALID_EXPIRATION':
        errorMessage = 'Invalid expiration date. Please re-enter card information.';
        break;
      case 'CARD_TOKEN_USED':
        errorMessage = 'Card token already used; Please try re-entering card details.';
        break;
      case 'INVALID_CARD':
        errorMessage = 'Invalid card number; Please try re-entering card details.';
        break;
      default:
        errorMessage = 'Payment error. Please contact support if issue persists.';
        break;
    }
    response.status(400).send({ errorMessage });
  }

  app.post('/chargeForCookie', async (request, response) => {
    const requestBody = request.body;
    const locations = await locationsApi.listLocations();
    const locationId = locations.locations[0].id;
    const order = await ordersApi.createOrder(locationId, {
      idempotency_key: crypto.randomBytes(12).toString('hex'),
      merchant_id: locations.locations[0].merchant_id,
      line_items: [
        {
          name: 'Cookie 🍪',
          quantity: '1',
          base_price_money: {
            amount: 100,
            currency: 'USD',
          },
        },
      ],
    });
    try {
      const chargeBody = {
        idempotency_key: crypto.randomBytes(12).toString('hex'),
        card_nonce: requestBody.nonce,
        amount_money: { ...order.order.total_money },
        order_id: order.order.id,
      };
      const transaction = await transactionsApi.charge(locationId, chargeBody);
      response.status(200).json(transaction.transaction);
    } catch (err) {
      handleTransactionError(err, response);
    }
  });

  const PORT: number = +process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Your app is listening on port ${PORT}`);
  });
}).catch((error: any) => console.log(error));
