import { HttpRequestHandlers } from "../htpp-middleware/request-handlers";

export class Router {
  httpRequestHandlers: HttpRequestHandlers = new HttpRequestHandlers();
  public routes: any = {
    "POST/signup": {
      controller: this.httpRequestHandlers.signup,
      authorized: false,
    },
    "POST/login": {
      controller: this.httpRequestHandlers.login,
      authorized: false,
    },
    "GET/user": {
      controller: this.httpRequestHandlers.getLogedUser,
      authorized: true,
    },
    "GET/data": {
        controller: this.httpRequestHandlers.data,
        authorized: false
    },
    default: {
      controller: this.httpRequestHandlers.noResponse,
      authorized: false,
    },
  };
}