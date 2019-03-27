import { Request } from 'express';

import ApplicationRouter from '../appdev/ApplicationRouter';
import { Session } from '../common/types';
import utils from '../common/utils';
import UsersRepo from '../repos/UsersRepo';

class RefreshRouter extends ApplicationRouter<Session> {
  constructor() {
    super('POST');
  }

  getPath(): string {
    return '/refresh/';
  }

  async content(req: Request): Promise<Session> {
    const refreshToken = utils.extractAuthToken(req.get('Authorization'));
    return UsersRepo.refreshSession(refreshToken);
  }
}

export default new RefreshRouter().router;
