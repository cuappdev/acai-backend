import squareConnect, {
  BatchRetrieveOrdersResponse,
  ChargeResponse,
  CreateCustomerCardResponse,
  CreateCustomerResponse,
  CreateOrderResponse,
  ListCatalogResponse,
  Order,
} from 'square-connect';

import { USD_IDENTIFIER } from '../common/constants';
import { ItemInput } from '../common/types';
import utils from '../common/utils';

const catalogAPI = new squareConnect.CatalogApi();
const customersAPI = new squareConnect.CustomersApi();
const ordersAPI = new squareConnect.OrdersApi();
const transactionsAPI = new squareConnect.TransactionsApi();

const defaultClient = squareConnect.ApiClient.instance;
const oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = process.env.ACCESS_TOKEN;
const locationID = process.env.LOCATION_ID;

const createCustomer = async (
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
): Promise<CreateCustomerResponse> => {
  const request = new squareConnect.CreateCustomerRequest();
  request.idempotency_key = utils.generateToken();
  request.email_address = email;
  request.family_name = lastName;
  request.given_name = firstName;
  request.phone_number = phoneNumber;
  return customersAPI.createCustomer(request);
};

const createCustomerCard = async (
  customerID: string,
  cardNonce: string,
): Promise<CreateCustomerCardResponse> => {
  const request = new squareConnect.CreateCustomerCardRequest();
  request.idempotency_key = utils.generateToken();
  request.customer_id = customerID;
  request.card_nonce = cardNonce;
  return customersAPI.createCustomerCard(request);
};

const createOrderFromInput = (items: ItemInput[], taxes: string[]): Order => {
  const order = new squareConnect.Order();
  order.location_id = locationID;
  order.line_items = items.map(({ id, quantity, modifiers }) => {
    const lineItem = new squareConnect.OrderLineItem();
    lineItem.catalog_object_id = id;
    lineItem.quantity = quantity;
    lineItem.modifiers = modifiers.map((modifierID) => {
      const modifier = new squareConnect.OrderLineItemModifier();
      modifier.catalog_object_id = modifierID;
      return modifier;
    });
    return lineItem;
  });
  order.taxes = taxes.map((id) => {
    const tax = new squareConnect.OrderLineItemTax();
    tax.catalog_object_id = id;
    return tax;
  });
  return order;
};

const createOrder = async (
  items: ItemInput[],
  taxes: string[],
): Promise<CreateOrderResponse> => {
  const request = new squareConnect.CreateOrderRequest();
  request.idempotency_key = utils.generateToken();
  request.order = createOrderFromInput(items, taxes);
  return ordersAPI.createOrder(locationID, request);
};

const chargeNewCard = async (
  customerID: string,
  cardNonce: string,
  orderID: string,
  total: number,
): Promise<ChargeResponse> => {
  const request = new squareConnect.ChargeRequest();
  request.customer_id = customerID;
  request.card_nonce = cardNonce;
  request.order_id = orderID;
  request.amount_money = {
    amount: total,
    currency: USD_IDENTIFIER,
  };
  return transactionsAPI.charge(locationID, request);
};

const chargeSavedCard = async (
  customerID: string,
  cardID: string,
  orderID: string,
  total: number,
): Promise<ChargeResponse> => {
  const request = new squareConnect.ChargeRequest();
  request.customer_id = customerID;
  request.customer_card_id = cardID;
  request.order_id = orderID;
  request.amount_money = {
    amount: total,
    currency: USD_IDENTIFIER,
  };
  return transactionsAPI.charge(locationID, request);
};

const fetchCatalog = async (): Promise<ListCatalogResponse> =>
  catalogAPI.listCatalog(new squareConnect.ListCatalogRequest());

const fetchOrders = async (orderIDs: string[]): Promise<BatchRetrieveOrdersResponse> => {
  try {
    const body = new squareConnect.BatchRetrieveOrdersRequest();
    body.order_ids = orderIDs;
    return ordersAPI.batchRetrieveOrders(locationID, body);
  } catch (e) {
    throw Error('Unable to retrieve order history');
  }
};

export default {
  chargeNewCard,
  chargeSavedCard,
  createCustomer,
  createCustomerCard,
  createOrder,
  fetchCatalog,
  fetchOrders,
};
