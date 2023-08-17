import RouterClass from "./Router.class.js";
import { saveMessage } from "../controllers/message.controller.js";
import { authorizationRole, passportCall } from "../middleware/session.js";

class MessageRouterClass extends RouterClass {
  init() {
    this.post("/", passportCall("jwt"), authorizationRole(["user", "premium"]), saveMessage);
  }
}

export default MessageRouterClass;
