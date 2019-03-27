import { Request } from 'express';

import ApplicationRouter from '../appdev/ApplicationRouter';
import { SerializedUser } from '../common/types';
import utils from '../common/utils';
import UsersRepo from '../repos/UsersRepo';

class SessionRouter extends ApplicationRouter<SerializedUser> {
  constructor() {
    super('POST');
  }

  getPath(): string {
    return '/session/';
  }

  async content(req: Request): Promise<SerializedUser> {
    const sessionToken = utils.extractAuthToken(req.get('Authorization'));
    return (await UsersRepo.getUserBySessionToken(sessionToken)).serialize();
  }
}

export default new SessionRouter().router;
