import { Request } from 'express';

import ApplicationRouter from '../appdev/ApplicationRouter';
import SquareAPI from '../common/SquareAPI';
import utils from '../common/utils';

class CatalogRouter extends ApplicationRouter<any> {
  constructor() {
    super('GET');
  }

  getPath(): string {
    return '/catalog/';
  }

  async content(req: Request): Promise<Object> {
    const catalog = await SquareAPI.fetchCatalog();
    return utils.parseCatalog(catalog);
  }
}

export default new CatalogRouter().router;
