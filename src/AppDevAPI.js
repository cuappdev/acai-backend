// @flow

import http from 'http'
import express, { Application, Router, Request, Response, NextFunction } from 'express';
import AppDevUtilities from './AppDevUtilities';

/**
 * ExpressHandlerFunction - the function signature of callbacks for Express
 * Router objects
 */
export type ExpressCallback = (Request, Response, NextFunction) => any;

/**
 * AppDevAPI - create an Express Application object from a series of middleware
 * and routers
 *
 * Subclasses can specify the middleware and routers required for implementing
 * the backend's API. This pattern is cleaner than than raw Express Application
 * initialization with middleware functions and routers.
 */
class AppDevAPI {

  express: Application;

  /**
   * Subclasses must call this constructor to set up the API
   */
  constructor() {
    this.express = express();
    this.init();
  }

  /**
   * Initialize the Express Application object using the middleware
   * and routers provided by the subclass.
   */
  init() {
    AppDevUtilities.tryCheckAppDevURL(this.getPath());
    let middleware = this.middleware();
    let routers = this.routers();

    for (let i = 0; i < middleware.length; i++) {
      this.express.use(middleware[i]);
    }

    for (let i = 0; i < routers.length; i++) {
      this.express.use(this.getPath(), routers[i]);
    }
  }

  /**
   * Subclasses must override this with the API's URL. Paths must
   * be an AppDev-formatted URL.
   */
  getPath(): string {
    return '/';
  }

  /**
   * Subclasses must override this to supply middleware for the API.
   */
  middleware(): ExpressCallback[] {
    return [];
  }

  /**
   * Subclasses must override this to supply middleware for the API.
   */
  routers(): Router[] {
    return [];
  }

  /**
   * Get an HTTP server backed by the Express Application
   */
  getServer(verbose: ?boolean = true): http.Server {
    const server: http.Server = http.createServer(this.express);
    const onError = (err: Error): void => {
      console.log(err);
    };

    const onListening = (): void => {
      let address = server.address().address;
      let port = server.address().port;
      verbose && console.log(`Listening on ${address}:${port}`);
    };

    server.on('error', onError);
    server.on('listening', onListening);
    return server;
  }

}

export default AppDevAPI;
