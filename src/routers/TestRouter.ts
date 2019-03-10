import { Request } from 'express';
import ApplicationRouter from '../appdev/ApplicationRouter';
import { SerializedUser } from '../entities/User';
import UsersRepo from '../repos/UsersRepo';

class TestRouter extends ApplicationRouter<Object> {
  constructor() {
    super('GET');
  }

  getPath(): string {
    return '/test/';
  }

  async content(req: Request): Promise<SerializedUser> {
    const user = await UsersRepo.createUser({
      customerId: 'cid',
      email: 'a@b.c',
      password: 'securepassword',
      firstName: 'john',
      lastName: 'doe',
      phoneNumber: '1111111111',
    });
    return UsersRepo.getUserById(user.id);
  }
}

export default new TestRouter().router;
