import { validate } from 'email-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import moment from 'moment';
import { getConnectionManager, Repository } from 'typeorm';

import SquareAPI from '../common/SquareAPI';
import { Session } from '../common/types';
import utils from '../common/utils';
import Transaction from '../entities/Transaction';
import User from '../entities/User';

const db = (): Repository<User> => getConnectionManager().get().getRepository(User);

const createUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumberString: string,
): Promise<User> => {
  try {
    const phoneNumberObj = parsePhoneNumberFromString(phoneNumberString, 'US');
    if (!(email && password && firstName && lastName
      && phoneNumberObj.isValid() && validate(email))) {
      throw Error();
    }
    const phoneNumber = phoneNumberObj.formatNational();
    const customer = await SquareAPI.createCustomer(
      email,
      firstName,
      lastName,
      phoneNumber,
    );
    const user = db().create({
      email,
      firstName,
      lastName,
      phoneNumber,
      customerID: customer.customer.id,
      passwordHash: utils.generateHash(password),
      ...utils.createSession(),
    });
    await db().save(user);
    return user;
  } catch (e) {
    throw Error('Unable to create user');
  }
};

const getUserByID = async (id: string): Promise<User> => {
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

const getTransactionsById = async (id: string): Promise<Transaction[]> => {
  const user = await db().findOne({
    where: { id },
    relations: ['transactions'],
  });
  return user.transactions;
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
  getUserByID,
  getUserByCredentials,
  getUserBySessionToken,
  getTransactionsById,
  refreshSession,
};
