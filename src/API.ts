import bodyParser from 'body-parser';
import { Router } from 'express';
import ApplicationAPI from './appdev/ApplicationAPI';
import HelloWorldRouter from './routers/HelloWorldRouter';
import LoginRouter from './routers/LoginRouter';
import RegisterRouter from './routers/RegisterRouter';
import TestRouter from './routers/TestRouter';

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
      v1: [
        HelloWorldRouter,
        LoginRouter,
        RegisterRouter,
        TestRouter,
      ],
    };
  }
}

export default API;
