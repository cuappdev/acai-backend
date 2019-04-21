import squareConnect, { CreateCustomerResponse, ListCatalogResponse } from 'square-connect';
import utils from '../common/utils';

const customersAPI = new squareConnect.CustomersApi();
const defaultClient = squareConnect.ApiClient.instance;
const oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = process.env.ACCESS_TOKEN;

const createCustomer = async (
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
): Promise<CreateCustomerResponse> => {
  try {
    const request = squareConnect.CreateCustomerRequest({
      idempotency_key: utils.generateToken(),
      email_address: email,
      family_name: lastName,
      given_name: firstName,
      phone_number: phoneNumber,
    });
    return customersAPI.createCustomer(request);
  } catch (e) {
    throw Error('Unable to create Square customer');
  }
};

const catalogAPI = new squareConnect.CatalogApi();
const fetchCatalog = async (): Promise<ListCatalogResponse> => {
  try {
    const request = squareConnect.ListCatalogRequest();
    return catalogAPI.listCatalog(request);
  } catch (e) {
    throw Error('Unable to fetch catalog');
  }
};

export default {
  createCustomer,
  fetchCatalog,
};
