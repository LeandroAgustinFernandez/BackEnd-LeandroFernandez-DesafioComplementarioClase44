import { Router } from "express";
import ProductManager from "../dao/MongoDbManagers/ProductManager.js";
import CartManager from "../dao/MongoDbManagers/CartManager.js";
import { authorizationRole, passportCall, passportCallRedirect } from "../middleware/session.js";

const router = Router();
const productManager = new ProductManager("./products.json");
const cartManager = new CartManager("./products.json");

router.get("/", passportCallRedirect('jwt'), async (request, response) => {
  response.render("user/login", {
    title: "Login",
    style: "home",
    logued: false,
  });
});

router.get("/login", passportCallRedirect('jwt'), async (request, response) => {
  response.render("user/login", {
    title: "Login",
    style: "home",
    logued: false,
  });
});

router.get("/resetpassword", async (request, response) => {
  response.render("user/resetpassword", {
    title: "Reset Password",
    style: "home",
    logued: false,
  });
});

router.get("/register", passportCallRedirect('jwt'), async (request, response) => {
  if (request.user?.email) return response.redirect("/products");
  response.render("user/register", {
    title: "Registro",
    style: "home",
    logued: false,
  });
});

router.get(
  "/perfil",
  passportCall("jwt"),
  authorizationRole(["user", "admin"]),
  async (request, response) => {
    const { user } = request.user;
    response.render("user/perfil", {
      title: "Registro",
      style: "home",
      user,
      logued: true,
    });
  }
);

router.get(
  "/products",
  passportCall("jwt"),
  authorizationRole(["user", "admin"]),
  async (request, response) => {
    const { user } = request.user;
    const { limit, sort, page, query } = request.query;
    const { docs, ...pag } = await productManager.getProducts(
      parseInt(limit),
      page,
      query,
      sort
    );
    let urlParams = `?`;
    if (query) urlParams += `query=${query}&`;
    if (limit) urlParams += `limit=${limit}&`;
    if (sort) urlParams += `sort=${sort}&`;
    pag.prevLink = pag.hasPrevPage ? `${urlParams}page=${pag.prevPage}` : null;
    pag.nextLink = pag.hasNextPage ? `${urlParams}page=${pag.nextPage}` : null;
    response.render("products", {
      error: docs === undefined,
      products: docs,
      pag,
      title: "Products",
      style: "home",
      sort,
      query,
      user,
      cart: user.cart,
      logued: true,
    });
  }
);

router.get(
  "/product/:pid",
  passportCall("jwt"),
  authorizationRole(["user", "admin"]),
  async (request, response) => {
    let { pid } = request.params;
    let product = await productManager.getProductById(pid);
    let error = product?.error ? true : false;
    response.render("productdetail", {
      error,
      product,
      title: `Product ${product.title}`,
      style: "home",
      logued: true,
    });
  }
);

router.get(
  "/newproduct",
  passportCall("jwt"),
  authorizationRole(["admin"]),
  async (request, response) => {
    response.render("newproduct", {
      title: "Products",
      style: "home",
      logued: true,
    });
  }
);

router.get(
  "/carts",
  passportCall("jwt"),
  authorizationRole(["user", "admin"]),
  async (request, response) => {
    const { user } = request.user;
    const cid = user.cart;
    let { products, _id } = await cartManager.getCart(cid);
    response.render("carts", {
      title: "Products",
      style: "home",
      products,
      _id,
      display: products.length > 0 ? true : false,
      logued: true,
    });
  }
);

router.get("/logout", async (request, response) => {
  response.clearCookie("tokenBE").redirect("/login");
});

router.get("/current", passportCall("jwt"), async (request, response) => {
  const { user } = request.user;
  response.send({ user });
});

export default router;
