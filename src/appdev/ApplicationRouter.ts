import { NextFunction, Request, Response, Router } from 'express';

/**
 * RequestType - the HTTP methods supported by ApplicationRouter
 */
export type RequestType = 'GET' | 'POST' | 'DELETE';

/**
 * ExpressHandlerFunction - the function signature of callbacks for Express
 * Router objects
 */
export type ExpressCallback = (req: Request, res: Response, next: NextFunction) => any;

/**
 * AppDevResponse - the response from an HTTP request
 *
 * Wraps a `success` field around the response data
 */
class AppDevResponse<T> {
  success: boolean;
  data: T;

  constructor(success: boolean, data: T) {
    this.success = success;
    this.data = data;
  }
}

/**
 * ApplicationRouter - cleanly create an Express Router object using inheritance
 *
 * Subclasses can simply specify the HTTP method, the path, and a response
 * hook to compute response data. This pattern is cleaner than raw Express
 * Router initialization with callbacks.
 */
class ApplicationRouter<T> {
  router: any;
  requestType: RequestType;

  /**
   * Subclasses must call this constructor and pass in the HTTP method
   */
  constructor(type: RequestType) {
    this.router = Router();
    this.requestType = type;

    // Initialize this router
    this.init();
  }

  /**
   * Initialize the Express Router using the specified path and response hook
   * implementation.
   */
  init() {
    const path = this.getPath();
    const middleware = this.middleware();

    // Attach middleware to router
    middleware.forEach((mw) => {
      this.router.use(mw);
    });

    // Attach content to router
    switch (this.requestType) {
      case 'GET':
        this.router.get(path, this.response());
        break;
      case 'POST':
        this.router.post(path, this.response());
        break;
      case 'DELETE':
        this.router.delete(path, this.response());
        break;
      default:
        throw new Error('HTTP method not specified!');
    }
  }

  /**
   * Subclasses must override this with the endpoint's URL. Paths must
   * be an AppDev-formatted URL
   */
  getPath(): string {
    throw new Error('You must implement getPath() with a valid path!');
  }

  middleware(): ExpressCallback[] {
    return [];
  }

  /**
   * Subclasses must override this response hook to generate response data
   * for the given request.
   */
  async content(req: Request): Promise<T> {
    throw new Error(null);
  }

  /**
   * Create a wrapper around the response hook to pass to the Express
   * Router.
   */
  response() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const content = await this.content(req);
        res.json(new AppDevResponse(true, content));
      } catch (e) {
        if (e.message === null) {
          throw new Error('You must implement content()!');
        } else {
          res.json(new AppDevResponse(false, { errors: [e.message] }));
        }
      }
      next();
    };
  }

}

export default ApplicationRouter;
