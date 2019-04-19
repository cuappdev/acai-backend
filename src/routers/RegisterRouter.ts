import { Request } from 'express';

import ApplicationRouter from '../appdev/ApplicationRouter';
import { SerializedUser } from '../common/types';
import UsersRepo from '../repos/UsersRepo';

class RegisterRouter extends ApplicationRouter<SerializedUser> {
  constructor() {
    super('POST');
  }

  getPath(): string {
    return '/register/';
  }

  async content(req: Request): Promise<SerializedUser> {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    const user = await UsersRepo.createUser(
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
    );
    return user.serialize();
  }
}

export default new RegisterRouter().router;
