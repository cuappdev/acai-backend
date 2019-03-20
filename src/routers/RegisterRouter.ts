import { randomBytes } from 'crypto';
import { validate } from 'email-validator';
import { Request, Response } from 'express';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import ApplicationRouter from '../appdev/ApplicationRouter';
import UsersRepo from '../repos/UsersRepo';

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
        const user = await UsersRepo.createUser({
          email,
          password,
          firstName,
          lastName,
          phoneNumber: formattedPhoneNumber,
          // TODO: Get customerId from Square API
          customerId: randomBytes(32).toString('hex'),
        });
        return UsersRepo.getUserById(user.id);
      }
      throw Error('Invalid phone number or email');
    }
    throw Error('Missing required field');
  }
}

export default new RegisterRouter().router;
