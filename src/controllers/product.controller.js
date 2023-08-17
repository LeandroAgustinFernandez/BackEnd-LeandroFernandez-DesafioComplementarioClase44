// import CustomError from "../middleware/errors/CustomError.js";
// import { generateProductErrorAttributes } from "../middleware/errors/info.js";
// import EErrors from '../middleware/errors/enum.js'
import { PRODUCT_SERVICES } from "../services/servicesManager.js";
import { generateProduct } from "../utils.js";

export const getProducts = async (request, response) => {
  const { limit, sort, page, query } = request.query;
  let res = await PRODUCT_SERVICES.getProducts(
    parseInt(limit),
    page,
    query,
    sort
  );
  let urlParams = `/api/products?`;
  if (query) urlParams += `query=${query}&`;
  if (limit) urlParams += `limit=${limit}&`;
  if (sort) urlParams += `sort=${sort}&`;
  res.prevLink = res.hasPrevPage ? `${urlParams}page=${res.prevPage}` : null;
  res.nextLink = res.hasNextPage ? `${urlParams}page=${res.nextPage}` : null;
  res?.error
    ? response.send({ status: `error`, products: res })
    : response.send({ status: `success`, products: res });
};

export const getProduct = async (request, response) => {
  const { pid } = request.params;
  let res = await PRODUCT_SERVICES.getProduct(pid);
  res?.error
    ? response.status(404).send({ status: `error`, ...res })
    : response.send({ status: `success`, product: res });
};

export const saveProduct = async (request, response) => {
  const { user } = request.user;
  const io = request.app.get("socketio");
  const { files, body } = request;
  let product = { ...body, status: true };
  let thumbnails = files.map((file) => file.originalname);
  product.thumbnails = thumbnails || [];
  product.owner = user._id;
  let res = await PRODUCT_SERVICES.saveProduct(product);
  let res2 = await PRODUCT_SERVICES.getProducts();
  response.send(res);
  io.emit("products", res2);
};

// export const saveProduct = async (request, response) => {
//   const { body } = request;
//   let product = { ...body, status: true };
//   if (
//     !product.title ||
//     !product.description ||
//     !product.price ||
//     !product.code ||
//     !product.status ||
//     !product.stock ||
//     !product.category
//   ) {
//     throw CustomError.createError({
//       name: "TYPE_ERROR",
//       cause: generateProductErrorAttributes(body),
//       message: "Error trying to create the product.",
//       code: EErrors.INVALID_TYPE_ERROR
//     });
//   }
//     product.thumbnails = [];
//     let res = await PRODUCT_SERVICES.saveProduct(product);
//     response.send(res);
// };

export const deleteProduct = async (request, response) => {
  const { user } = request.user;
  if(user.role === "premium") { 
    let res = await PRODUCT_SERVICES.getProduct(pid);
    if(res.owner.toString() !== user._id) {
      return response.status(401).send({ error: 'You do not have permissions to perform this action'})
    }
  }
  let { pid } = request.params;
  // const io = request.app.get("socketio");
  let res = await PRODUCT_SERVICES.deleteProduct(pid);
  // let res2 = await PRODUCT_SERVICES.getProducts();
  response.send(res);
  // io.emit("products", res2);
};

export const updateProduct = async (request, response) => {
  let { pid } = request.params;
  let res = await PRODUCT_SERVICES.updateProduct(pid, request.body);
  res?.error
    ? response.status(400).send({ ...res })
    : response.send({ product: res });
};

export const getMocksProducts = async (request, response) => {
  let products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProduct());
  }
  response.send(products);
};
