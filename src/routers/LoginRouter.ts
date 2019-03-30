import { Request } from 'express';

import ApplicationRouter from '../appdev/ApplicationRouter';
import { SerializedUser } from '../common/types';
import UsersRepo from '../repos/UsersRepo';

class LoginRouter extends ApplicationRouter<SerializedUser> {
  constructor() {
    super('POST');
  }

  getPath(): string {
    return '/login/';
  }

  async content(req: Request): Promise<SerializedUser> {
    const { email, password } = req.body;
    const user = await UsersRepo.getUserByCredentials(email, password);
    const session = await UsersRepo.refreshSession(user.refreshToken);
    return {
      ...user.serialize(),
      session,
    };
  }
}

export default new LoginRouter().router;
