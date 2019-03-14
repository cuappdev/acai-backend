import { randomBytes } from 'crypto';
import { Request, Response } from 'express';

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

    const user = await UsersRepo.createUser({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      // TODO: Get customerId from Square API
      customerId: randomBytes(32).toString('hex'),
    });
    return UsersRepo.getUserById(user.id);
  }
}

export default new RegisterRouter().router;
