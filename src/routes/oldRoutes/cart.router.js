import { Router } from "express";
import CartManager from "../../dao/MongoDbManagers/CartManager.js";
import { passportCall } from "../../middleware/session.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", passportCall('jwt'),async (request, response) => {
  const { cid } = request.user.cart;
  let res = await cartManager.getCart(cid);
  res?.error
    ? response.status(404).send({ res })
    : response.send({ status: `success`, payload: res });
});

router.post("/", async (request, response) => {
  let res = await cartManager.addCart();
  res?.error
    ? response.status(404).send({ status: res.error })
    : response.send({ status: `The cart was created succesfully.`, payload: res });
});

router.post("/:cid/products/:pid", async (request, response) => {
  const { cid, pid } = request.params;
  let res = await cartManager.addProductToCart(cid, pid);
  res?.error
    ? response.status(400).send({ ...res })
    : response.send({ ...res });
});

router.delete("/:cid/products/:pid", async (request, response) => {
  const { cid, pid } = request.params;
  let res = await cartManager.deleteProduct(cid, pid);
  res?.error
    ? response.status(400).send({ ...res })
    : response.send({ ...res });
});

router.delete("/:cid/", async (request, response) => {
  const { cid } = request.params;
  let res = await cartManager.deleteAllProducts(cid);
  res?.error
    ? response.status(400).send({ ...res })
    : response.send({ ...res });
});

router.put("/:cid", async (request, response) => {
  const { cid } = request.params;
  const { products } = request.body;
  let res = await cartManager.updateProducts(cid, products);
  res?.error
    ? response.status(400).send({ ...res })
    : response.send({ ...res });
});

router.put("/:cid/products/:pid", async (request, response) => {
  const { cid, pid } = request.params;
  const { quantity } = request.body;
  let res = await cartManager.updateProductQuantity(cid, pid, quantity);
  res?.error
    ? response.status(400).send({ ...res })
    : response.send({ ...res });
});

export default router;
