import squareConnect from 'square-connect';
import {
  BatchRetrieveOrdersResponse,
  CreateCustomerResponse,
  ListCatalogResponse,
} from 'square-connect-ts';
import utils from '../common/utils';

const customersAPI = new squareConnect.CustomersApi();
const ordersAPI = new squareConnect.OrdersApi();

const defaultClient = squareConnect.ApiClient.instance;
const locationID = process.env.LOCATION_ID;
const oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = process.env.ACCESS_TOKEN;

const createCustomer = async (
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
): Promise<CreateCustomerResponse> => {
  try {
    const request = new squareConnect.CreateCustomerRequest();
    request.idempotency_key = utils.generateToken();
    request.email_address = email;
    request.family_name = lastName;
    request.given_name = firstName;
    request.phone_number = phoneNumber;
    return customersAPI.createCustomer(request);
  } catch (e) {
    throw Error('Unable to create Square customer');
  }
};

const fetchOrders = async (orderIDs: string[]): Promise<BatchRetrieveOrdersResponse> => {
  try {
    const body = new squareConnect.BatchRetrieveOrdersRequest();
    body.order_ids = orderIDs;
    return ordersAPI.BatchRetrieveOrders(locationID, body);
  } catch (e) {
    throw Error('Unable to retrieve order history');
  }
};

export default {
  createCustomer,
  fetchOrders,
};
