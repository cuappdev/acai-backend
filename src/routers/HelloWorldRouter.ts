import  { Request } from 'express';
import AppDevRouter from '../appdev/AppDevRouter';

class HelloWorldRouter extends AppDevRouter<Object> {
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
