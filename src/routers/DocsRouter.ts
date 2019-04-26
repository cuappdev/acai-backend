import { Request } from 'express';
import * as swaggerUI from 'swagger-ui-express';
import ApplicationRouter, { ExpressCallback } from '../appdev/ApplicationRouter';
import * as swaggerDocument from '../swagger.json';

class DocsRouter extends ApplicationRouter<any> {
  constructor() {
    super('GET');
  }

  getPath(): string {
    return '/';
  }

  middleware(): ExpressCallback[] {
    return [swaggerUI.serve, swaggerUI.setup(swaggerDocument)];
  }

  async content(req: Request): Promise<Object> {
    return null;
  }
}

export default new DocsRouter().router;
