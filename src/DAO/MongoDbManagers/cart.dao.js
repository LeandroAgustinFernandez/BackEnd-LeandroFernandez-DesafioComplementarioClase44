import ProductManager from "./product.dao.js";
import { cartModel } from "../models/cart.model.js";

export default class CartManagerDB {

  async create() {
    try {
      let result = await cartModel.create({ products: [] });
      return result;
    } catch (error) {
      return { error: `There is an error creating the cart.` };
    }
  }

  async #getCarts() {
    let result = await cartModel.find({}, { __v: 0 }).lean();
    return result;
  }

  async get(id) {
    try {
      let cart = await cartModel.findOne({ _id: id }, { __v: 0 }).lean();
      if (!cart) throw new Error(`The cart not exist.`);
      return cart;
    } catch (error) {
      return { error: error.message };
    }
  }

  async addProductToCart(cid, pid) {
    try {
      let product = await this.#checkIfProductExist(pid);
      if (product?.error) throw new Error(`The product does not exist.`);
      let cart = await this.get(cid);
      if (cart?.error) throw new Error(`The cart does not exist.`);
      let productExist = cart.products.find(({ product }) => product._id.toString() === pid);
      let result;
      if (productExist) {
        result = await cartModel.updateOne(
          { _id: cid, "products.product": pid },
          { $inc: { "products.$.quantity": 1 } }
        );
      } else {
        result = await cartModel.updateOne(
          { _id: cid },
          { $push: { products: { product: pid, quantity: 1 } } }
        );
      }
      return {
        success: `The product was added successfully in cart`,
        payload: result,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async deleteAllProducts(id) {
    try {
      let result = await cartModel.updateOne({ _id: id }, { products: [] });
      return { success: `The product list was successfully delete`, payload: result };
    } catch (error) {
      return { error: error.message };
    }
  }

  async deleteProduct(cid, pid) {
    try {
      let result = await cartModel.updateOne(
        { _id: cid },
        { $pull: { products: { product: { _id: pid } } } }
      );
      return { success: `The product was successfully delete`, payload: result };
    } catch (error) {
      return { error: error.message };
    }
  }

  async updateProducts(cid, products) {
    try {
      let result = await cartModel.updateOne(
        { _id: cid },
        { $set: { products: products } }
      );
      return { success: `The products were successfully add`, payload: result };
    } catch (error) {
      return { error: error.message };
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      let result = await cartModel.updateOne(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": quantity } }
      );
      return { success: `The product quantity was successfully updated`, payload: result };
    } catch (error) {
      return { error: error.message };
    }
  }

  async #checkIfProductExist(pid) {
    let productManager = new ProductManager();
    let product = await productManager.get(pid);
    return product;
  }
}
