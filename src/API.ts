import bodyParser from 'body-parser';
import { Router } from 'express';
import ApplicationAPI from './appdev/ApplicationAPI';
import CatalogRouter from './routers/CatalogRouter';
import CreateOrderRouter from './routers/CreateOrderRouter';
import DocsRouter from './routers/DocsRouter';
import LoginRouter from './routers/LoginRouter';
import OrderHistoryRouter from './routers/OrderHistoryRouter';
import RefreshRouter from './routers/RefreshRouter';
import RegisterRouter from './routers/RegisterRouter';
import SessionRouter from './routers/SessionRouter';

class API extends ApplicationAPI {
  getPath(): string {
    return '/api/';
  }

  middleware(): any[] {
    return [
      bodyParser.json(),
    ];
  }

  routerGroups(): { [index: string]: Router[] } {
    return {
      docs: [DocsRouter],
      v1: [
        CatalogRouter,
        CreateOrderRouter,
        LoginRouter,
        OrderHistoryRouter,
        RefreshRouter,
        RegisterRouter,
        SessionRouter,
      ],
    };
  }
}

export default API;
