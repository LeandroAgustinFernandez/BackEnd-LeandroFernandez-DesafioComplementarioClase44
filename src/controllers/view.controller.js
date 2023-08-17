import { PRODUCT_SERVICES, CART_SERVICES, SESSION_SERVICES } from "../services/servicesManager.js";

export const loginView = async (request, response) => {
  response.render("user/login", {
    title: "Login",
    style: "home",
    logued: false,
  });
};

export const resetPasswordView = async (request, response) => {
  let { idurl } = request.params
  let result = await SESSION_SERVICES.checkResetUrl(idurl);
  if(!result?.email) {
    response.redirect("/recoverpassword")
    return;
  }
  let create = new Date(result.recover_password.createTime);
  let now = new Date();
  let minutes = (now.getTime()-create.getTime()) / 1000 / 60;
  if(minutes > 60) {
    await SESSION_SERVICES.resetRecoverPassword(result.email)
    response.redirect("/login")
    return;
  }
  response.render("user/resetpassword", {
    title: "Reset Password",
    style: "home",
    logued: false,
    email: result.email,
    idurl: result.recover_password.id_url
  });
};

export const recoverPassword = async (request, response) => {
  response.render("user/recoverpassword", {
    title: "Recover Password",
    style: "home",
    logued: false,
  });
};

export const registerView = async (request, response) => {
  if (request.user?.email) return response.redirect("/products");
  response.render("user/register", {
    title: "Registro",
    style: "home",
    logued: false,
  });
};

export const perfilView = async (request, response) => {
  const { user } = request.user;
  console.log(user);
  response.render("user/perfil", {
    title: "Registro",
    style: "home",
    user,
    role: user.role === 'admin' || user.role === 'premium',
    logued: true,
  });
};

export const productsView = async (request, response) => {
  const { user } = request.user;
  const { limit, sort, page, query } = request.query;
  const { docs, ...pag } = await PRODUCT_SERVICES.getProducts(
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
    role: user.role === 'admin' || user.role === 'premium',
    cart: user.cart,
    logued: true,
  });
};

export const productDetailView = async (request, response) => {
  const { user } = request.user;
  let { pid } = request.params;
  let product = await PRODUCT_SERVICES.getProduct(pid);
  let error = product?.error ? true : false;
  response.render("productdetail", {
    error,
    product,
    title: `Product ${product.title}`,
    style: "home",
    logued: true,
    role: user.role === 'admin' || user.role === 'premium',
    cart: user.cart,
  });
};

export const newProductView = async (request, response) => {
  const { user } = request.user;
  response.render("newproduct", {
    title: "Products",
    style: "home",
    logued: true,
    role: user.role === 'admin' || user.role === 'premium',
  });
};

export const cartView = async (request, response) => {
  const { user } = request.user;
  const cid = user.cart;
  let { products, _id } = await CART_SERVICES.getCart(cid);
  response.render("carts", {
    title: "Products",
    style: "home",
    products,
    _id,
    display: products.length > 0 ? true : false,
    
    logued: true,
  });
};

export const logoutView = async (request, response) => {
  response.clearCookie("tokenBE").redirect("/login");
};

export const chatView = async (request, response) => {
  const { user } = request.user;
  response.render("chat", { title: "Chat",style: "styles", logued: true, user });
};
