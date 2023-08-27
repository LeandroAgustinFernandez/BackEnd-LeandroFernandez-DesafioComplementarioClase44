import RouterClass from "./Router.class.js";
import { current, login, recoverpassword, register, resetpassword, changeRole, uploadDocuments } from "../controllers/session.controller.js";
import { passportCall } from "../middleware/session.js";
import { uploader } from "../utils.js";

class SessionRouterClass extends RouterClass {
  init() {
    this.post("/login", login);
    this.post("/register", register);
    this.post("/resetpassword", resetpassword);
    this.post("/recoverpassword", recoverpassword);
    this.get("/current", passportCall("jwt"), current);
    this.get("/premium/:uid", changeRole);
    this.post("/:uid/documents", uploader.any(), uploadDocuments)
  }
}

export default SessionRouterClass;
