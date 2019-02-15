import bodyParser from 'body-parser';
import { Router } from 'express';
import AppDevAPI from './appdev/AppDevAPI';
import HelloWorldRouter from './routers/HelloWorldRouter';

class API extends AppDevAPI {
  getPath(): string {
    const unusedVariable = "hello world"
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
