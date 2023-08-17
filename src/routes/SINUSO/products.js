// import { Router } from "express";
// import errorHandler from '../middleware/errors/index.js';
// import toAsyncExpressDecorator from "async-express-decorator";

// const router = toAsyncExpressDecorator(Router());

// router.get("/mocking-products", getMocksProducts);
// router.get(
//   "/",
//   passportCall("jwt"),
//   authorizationRole(["user", "admin"]),
//   getProducts
// );
// router.post("/", passportCall("jwt"), authorizationRole(["admin"]), uploader.array("thumbnails"), saveProduct);
// // router.post("/", saveProduct);
// router.get(
//   "/:pid",
//   passportCall("jwt"),
//   authorizationRole(["user", "admin"]),
//   getProduct
// );
// router.delete(
//   "/:pid",
//   passportCall("jwt"),
//   authorizationRole(["admin"]),
//   deleteProduct
// );
// router.put(
//   "/:pid",
//   passportCall("jwt"),
//   authorizationRole(["admin"]),
//   updateProduct
// );
// router.use(errorHandler);