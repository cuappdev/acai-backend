import { Request } from 'express';

import ApplicationRouter from '../appdev/ApplicationRouter';
import utils from '../common/utils';

class CatalogRouter extends ApplicationRouter<any> {
  constructor() {
    super('GET');
  }

  getPath(): string {
    return '/catalog/';
  }

  async content(req: Request): Promise<Object> {
    return utils.parseCatalog();
  }
}

export default new CatalogRouter().router;
