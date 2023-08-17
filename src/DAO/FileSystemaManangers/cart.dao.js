import ProductManager from "./product.dao.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { __dirname } from "../../utils.js";

export default class CartManagerFiles {
  constructor() {
    this.path = "./src/DAO/FSyFiles/carts.json";
  }

  async create() {
    let carts = fs.existsSync(this.path) ? await this.#getCarts() : [];
    let newCart = { _id: uuidv4(), products: [] };
    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async #getCarts() {
    let response = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(response);
  }

  async get(id) {
    try {
      let carts = await this.#getCarts();
      let cart;
      if (id?._id) {
        cart = carts.find((cart) => cart._id === id._id);
      } else {
        cart = carts.find((cart) => cart._id === id);
      }
      if (!cart) throw new Error(`The cart not exist.`);
      return cart;
    } catch (error) {
      return { error: error.message };
    }
  }

  async addProductToCart(cid, pid) {
    try {
      if (await this.#checkIfProductExist(pid))
        throw new Error(`The product does not exist.`);
      let product = await this.#getProduct(pid);
      let carts = await this.#getCarts();
      if (!carts.find((cart) => cart._id === cid))
        throw new Error(`The cart does not exist.`);
      carts.forEach((cart) => {
        if (cart._id === cid) {
          let isInCart = cart.products.find((item) => item.product._id === pid);
          if (isInCart) {
            cart.products.forEach((item) => {
              if (item.product._id === pid) item.quantity++;
              return item;
            });
          } else {
            cart.products.push({ product, quantity: 1 });
          }
        }
      });
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return {
        success: `The product was added successfully in cart`,
        payload: carts,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async deleteAllProducts(cid) {
    try {
      let carts = await this.#getCarts();
      if (!carts.find((cart) => cart._id === cid))
        throw new Error(`The cart does not exist.`);
      carts.forEach((cart) => {
        if (cart._id === cid) cart.products = [];
      });
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return {
        success: `The products was deleted successfully in cart`,
        payload: carts,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async deleteProduct(cid, pid) {
    try {
      let carts = await this.#getCarts();
      if (!carts.find((cart) => cart._id === cid))
        throw new Error(`The cart does not exist.`);
      let newProducts = [];

      carts.forEach((cart) => {
        if (cart._id === cid) {
          cart.products.forEach((product) => {            
            if (product.product._id !== pid) newProducts.push(product);
          });
          cart.products = newProducts;
        }
      });
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return {
        success: `The product in cart was deleted successfully`,
        payload: carts,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async updateProducts(cid, newProducts) {
    try {
      let carts = await this.#getCarts();
      if (!carts.find((cart) => cart._id === cid))
        throw new Error(`The cart does not exist.`);
      carts.forEach((cart) => {
        if (cart._id === cid) cart.products = newProducts;
      });
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return {
        success: `The product in cart was updated successfully`,
        payload: carts,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      let carts = await this.#getCarts();
      if (!carts.find((cart) => cart._id === cid))
        throw new Error(`The cart does not exist.`);
      carts.forEach((cart) => {
        if (cart._id === cid) {
          cart.products.forEach((product) => {
            if (product.product._id === pid) product.quantity += quantity;
          });
        }
      });
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return {
        success: `The quantity was updated successfully`,
        payload: carts,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async #checkIfProductExist(pid) {
    let productManager = new ProductManager();
    let products = await productManager.getAllProducts();
    return !products.find((product) => product._id === pid);
  }

  async #getProduct(pid) {
    let productManager = new ProductManager();
    let products = await productManager.getAllProducts();
    return products.find((product) => product._id === pid);
  }
}
