import { Router } from "express";
import ProductManager from "../dao/MongoDbManagers/ProductManager.js";
import { uploader } from "../utils.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (request, response) => {
  const { limit, sort, page, query } = request.query
  let res = await productManager.getProducts(parseInt(limit), page, query, sort);
  let urlParams = `/api/products?`;
  if (query) urlParams += `query=${query}&`
  if (limit) urlParams += `limit=${limit}&`
  if (sort) urlParams += `sort=${sort}&`
  res.prevLink = res.hasPrevPage ? `${urlParams}page=${res.prevPage}` : null;
  res.nextLink = res.hasNextPage ? `${urlParams}page=${res.nextPage}` : null;
  res?.error 
    ? response.send({ status: `error`, products: res })
    : response.send({ status: `success`, products: res });
});

router.get("/:pid", async (request, response) => {
  const { pid } = request.params;
  let res = await productManager.getProductById(pid);
  res?.error
    ? response.status(404).send({ status:`error`, ...res })
    : response.send({status: `success`, product: res });
});

router.post("/", uploader.array("thumbnails"), async (request, response) => {
  const io = request.app.get("socketio");
  const { files, body } = request;
  let product = { ...body, status: true };
  let thumbnails = files.map((file) => file.originalname);
  product.thumbnails = thumbnails;
  let res = await productManager.addProduct(product);
  let res2 = await productManager.getProducts();
  response.send(res);
  io.emit("products", res2);
});

router.delete("/:pid", async (request, response) => {
  let { pid } = request.params;
  const io = request.app.get("socketio");
  let res = await productManager.deleteProduct(pid);
  let res2 = await productManager.getProducts();
  response.send(res);
  io.emit("products", res2);
});

router.put("/:pid", async (request, response) => {
  let { pid } = request.params;
  let res = await productManager.updateProduct(pid, request.body);
  res?.error
    ? response.status(400).send({ ...res })
    : response.send({ product: res });
});

export default router;
