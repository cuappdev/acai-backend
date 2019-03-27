import bodyParser from 'body-parser';
import { Router } from 'express';
import ApplicationAPI from './appdev/ApplicationAPI';
import HelloWorldRouter from './routers/HelloWorldRouter';
import LoginRouter from './routers/LoginRouter';
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
      v1: [
        HelloWorldRouter,
        LoginRouter,
        RefreshRouter,
        RegisterRouter,
        SessionRouter,
      ],
    };
  }
}

export default API;
