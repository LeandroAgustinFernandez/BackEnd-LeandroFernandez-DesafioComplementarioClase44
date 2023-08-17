import RouterClass from "./Router.class.js";
import { getLogs } from '../controllers/logger.controller.js'

class LoggerRouterClass extends RouterClass {
  init() {
    this.get("/loggerTest", getLogs);
  }
}

export default LoggerRouterClass;
