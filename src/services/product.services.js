import { PRODUCT_REPOSITORY } from "../repository/repositoryManager.js";

export default class ProductServices {
  getProducts = async (limit, page, query, sort) => await PRODUCT_REPOSITORY.getProducts(parseInt(limit), page, query, sort);
  getProduct = async (id) => await PRODUCT_REPOSITORY.getProduct(id);
  saveProduct = async (product) => await PRODUCT_REPOSITORY.addProduct(product);
  deleteProduct = async (id) => await PRODUCT_REPOSITORY.deleteProduct(id);
  updateProduct = async (id, product) =>
    await PRODUCT_REPOSITORY.updateProduct(id, product);
}
