import { randomBytes } from 'crypto';
import { validate } from 'email-validator';
import { Request, Response } from 'express';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import squareConnect from 'square-connect';

import ApplicationRouter from '../appdev/ApplicationRouter';
import UsersRepo from '../repos/UsersRepo';

const customersApi = new squareConnect.CustomersApi();
const defaultClient = squareConnect.ApiClient.instance;
const oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = process.env.ACCESS_TOKEN;

class RegisterRouter extends ApplicationRouter<Object> {
  constructor() {
    super('POST');
  }

  getPath(): string {
    return '/register/';
  }

  async content(req: Request): Promise<Object> {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    if (email && password && firstName && lastName && phoneNumber) {
      const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, 'US');
      if (parsedPhoneNumber.isValid() && validate(email)) {
        const formattedPhoneNumber = parsedPhoneNumber.formatNational();
        try {
          const customerBody = {
            idempotency_key: randomBytes(12).toString('hex'),
            email_address: email,
            family_name: lastName,
            given_name: firstName,
            phone_number: formattedPhoneNumber,
          };
          const customer = await customersApi.createCustomer(customerBody);
          const user = await UsersRepo.createUser({
            email,
            password,
            firstName,
            lastName,
            phoneNumber: formattedPhoneNumber,
            customerId: customer.customer.id,
          });
          return await UsersRepo.getUserById(user.id);
        } catch (err) {
          throw Error('Unable to create user');
        }
      }
      throw Error('Invalid phone number or email');
    }
    throw Error('Missing required field');
  }
}

export default new RegisterRouter().router;
