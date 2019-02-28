import bodyParser from 'body-parser';
import crypto from 'crypto';
import express, { Response } from 'express';
// @ts-ignore
import squareConnect, { LocationsApi, OrdersApi, TransactionsApi } from 'square-connect';

const defaultClient = squareConnect.ApiClient.instance;
const locationsApi = new squareConnect.LocationsApi();
const oauth2 = defaultClient.authentications['oauth2'];
const ordersApi = new squareConnect.OrdersApi();
const transactionsApi = new squareConnect.TransactionsApi();

oauth2.accessToken = process.env.ACCESS_TOKEN;

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
  console.log(
    `[Error] Status:${error.status}, Messages: ${JSON.stringify(
      (JSON.parse(error.response.text)).errors, null, 2)}`,
  );

  const { errors } = JSON.parse(error.response.text);
  let errorMessage;
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
      amount_money: {
        ...order.order.total_money,
      },
      order_id: order.order.id,
    };
    const transaction = await transactionsApi.charge(locationId, chargeBody);

    response.status(200).json(transaction.transaction);
  } catch (err) {
    handleTransactionError(err, response);
  }
});

const PORT: number = +process.env.PORT || 80;

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
