import bodyParser from 'body-parser';
import AppDevAPI from './appdev/AppDevAPI';
import { Router } from 'express';

import HelloWorldRouter from './routers/HelloWorldRouter';

class API extends AppDevAPI {
  getPath(): string {
    return '/api/';
  }

  middleware(): [any] {
    return [
      bodyParser.json(),
    ];
  }

  routers(): [Router] {
    return [
      HelloWorldRouter,
    ];
  }
}

export default API;
