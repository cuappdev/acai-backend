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

  routerGroups(): { [index: string]: [Router] } {
    return {
      v1: [
        HelloWorldRouter,
      ],
    };
  }
}

export default API;
