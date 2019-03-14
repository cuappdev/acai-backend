import { Request, Response } from 'express';

import ApplicationRouter from '../appdev/ApplicationRouter';
import UsersRepo from '../repos/UsersRepo';

class LoginRouter extends ApplicationRouter<Object> {
  constructor() {
    super('POST');
  }

  getPath(): string {
    return '/login/';
  }

  async content(req: Request): Promise<Object> {
    const { email, password } = req.body;
    return UsersRepo.authUser(email, password);
  }
}

export default new LoginRouter().router;
