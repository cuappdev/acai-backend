import { validate } from 'email-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import moment from 'moment';
import squareConnect from 'square-connect';
import { getConnectionManager, Repository } from 'typeorm';

import { Session } from '../common/types';
import utils from '../common/utils';
import User from '../entities/User';

const db = (): Repository<User> => getConnectionManager().get().getRepository(User);
const customersAPI = new squareConnect.CustomersApi();
const defaultClient = squareConnect.ApiClient.instance;
const oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = process.env.ACCESS_TOKEN;

type CreateUserFields = {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
};

const createUser = async (fields: CreateUserFields): Promise<User> => {
  try {
    const { email, password, firstName, lastName } = fields;
    const parsedPhoneNumber = parsePhoneNumberFromString(fields.phoneNumber, 'US');
    if (!(email && password && firstName && lastName
          && parsedPhoneNumber.isValid() && validate(email))) {
      throw Error();
    }
    const phoneNumber = parsedPhoneNumber.formatNational();
    const customer = await customersAPI.createCustomer({
      idempotency_key: utils.generateToken(),
      email_address: email,
      family_name: lastName,
      given_name: firstName,
      phone_number: phoneNumber,
    });
    const user = db().create({
      email,
      firstName,
      lastName,
      phoneNumber,
      customerId: customer.customer.id,
      passwordHash: utils.generateHash(password),
      ...utils.createSession(),
    });
    await db().save(user);
    return user;
  } catch (e) {
    throw Error('Unable to create user');
  }
};

const getUserById = async (id: string): Promise<User> => {
  try {
    return db().findOne({ id });
  } catch (e) {
    throw Error('Unable to find user');
  }
};

const getUserByCredentials = async (email: string, password: string): Promise<User> => {
  try {
    return db().findOne({
      email,
      passwordHash: utils.generateHash(password),
    });
  } catch (e) {
    throw Error('Unable to authenticate user');
  }
};

const getUserBySessionToken = async (sessionToken: string): Promise<User> => {
  try {
    const user = await db().findOne({ sessionToken });
    if (moment(user.sessionExpiration) <= moment()) {
      throw Error();
    }
    return user;
  } catch (e) {
    throw Error('Unable to authenticate session');
  }
};

const refreshSession = async (refreshToken: string): Promise<Session> => {
  try {
    const session = utils.createSession();
    const user = {
      ...await db().findOne({ refreshToken }),
      ...session,
    };
    await db().save(user);
    return session;
  } catch (e) {
    throw Error('Unable to refresh session');
  }
};

export default {
  createUser,
  getUserById,
  getUserByCredentials,
  getUserBySessionToken,
  refreshSession,
};
