import bodyParser from 'body-parser';
import { Router } from 'express';
import ApplicationAPI from './appdev/ApplicationAPI';
import HelloWorldRouter from './routers/HelloWorldRouter';

class API extends ApplicationAPI {
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
