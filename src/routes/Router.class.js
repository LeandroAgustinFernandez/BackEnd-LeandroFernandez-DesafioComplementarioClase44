import { Router, request } from "express";

class RouterClass {
  constructor() {
    this.router = Router();
    this.init();
  }

  init() {}

  getRouter() {
    return this.router;
  }

  get(path, ...cbs) {
    this.router.get(path, this.applayCallbacks(cbs));
  }

  post(path, ...cbs) {
    this.router.post(path, this.applayCallbacks(cbs));
  }

  put(path, ...cbs) {
    this.router.put(path, this.applayCallbacks(cbs));
  }

  delete(path, ...cbs) {
    this.router.delete(path, this.applayCallbacks(cbs));
  }

  applayCallbacks(cbs) {
    return cbs.map((cb) => async (...params) => {
      try {
        await cb.apply(this, params);
      } catch (error) {
        params[1].status(500).send(error);
      }
    });
  }

  generateCustomResponse(request, response, next) {
    response.sendSuccess = payload = response.send({
      status: "success",
      payload,
    });
    response.sendServerError = error = response.status(500).send({
      status: "error",
      error,
    });
    response.sendUserError = error = response.status(500).send({ status: "error", error });
    next();
  }
}

export default RouterClass;
