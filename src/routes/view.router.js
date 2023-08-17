import RouterClass from "./Router.class.js";
import {
  authorizationRole,
  passportCall,
  passportCallRedirect,
} from "../middleware/session.js";
import {
  cartView,
  chatView,
  loginView,
  logoutView,
  newProductView,
  perfilView,
  productDetailView,
  productsView,
  registerView,
  resetPasswordView,
  recoverPassword
} from "../controllers/view.controller.js";

class ViewRouterClass extends RouterClass {
  init() {
    this.get("/", passportCallRedirect("jwt"), loginView);
    this.get("/login", passportCallRedirect("jwt"), loginView);
    this.get("/resetpassword/:idurl", resetPasswordView);
    this.get("/recoverpassword", recoverPassword);
    this.get("/register", passportCallRedirect("jwt"), registerView);
    this.get("/perfil", passportCall("jwt"), authorizationRole(["user", "admin","premium"]), perfilView );
    this.get("/products", passportCall("jwt"), authorizationRole(["user", "admin","premium"]), productsView);
    this.get("/product/:pid", passportCall("jwt"), authorizationRole(["user", "admin","premium"]), productDetailView);
    this.get("/newproduct", passportCall("jwt"), authorizationRole(["admin","premium"]), newProductView);
    this.get("/carts", passportCall("jwt"), authorizationRole(["user", "admin","premium"]), cartView);
    this.get("/logout", logoutView);
    this.get("/chat", passportCall("jwt"), authorizationRole(["user","premium"]), chatView);
  }
}

export default ViewRouterClass;
