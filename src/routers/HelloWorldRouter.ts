import { Request } from 'express';
import ApplicationRouter from '../appdev/ApplicationRouter';

class HelloWorldRouter extends ApplicationRouter<Object> {
  constructor() {
    super('GET');
  }

  getPath(): string {
    return '/';
  }

  async content(req: Request): Promise<Object> {
    return { message: 'Hello world' };
  }
}

export default new HelloWorldRouter().router;
