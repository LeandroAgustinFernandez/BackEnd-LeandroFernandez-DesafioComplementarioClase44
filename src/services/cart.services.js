import { CART_REPOSITORY } from "../repository/repositoryManager.js";

export default class CartServices {
  getCart = async (id) => await CART_REPOSITORY.getCart(id)
  createCart = async () => await CART_REPOSITORY.addCart();
  deleteCart = async (id) => await CART_REPOSITORY.deleteAllProducts(id);
  updateCart = async (id, products) => await CART_REPOSITORY.updateProducts(id, products);
  updateProductInCart = async (cid, pid, quantity) => await CART_REPOSITORY.updateProductQuantity(cid, pid, quantity);
  addProductInCart = async (cid, pid) => await CART_REPOSITORY.addProductToCart(cid, pid)
  deleteProductInCart = async (cid, pid) => await CART_REPOSITORY.deleteProduct(cid, pid)
}