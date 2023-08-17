import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { __dirname } from "../../utils.js";

export default class ProductManagerFiles {
  constructor() {
    this.path = "./src/DAO/FSyFiles/products.json";
  }

  async getAll(limit, page = 1, query = false, sort = false) {
    try {
      if (fs.existsSync(this.path)) {
        let products = JSON.parse(
          await fs.promises.readFile(this.path, "utf-8")
        );
        let pagination = this.#createPagination(products.length, limit, page);
        products = this.#orderProducts(products, sort);
        products = this.#filterQuery(products, query);
        products = this.#productToShow(products, limit, page);
        pagination.docs = products;
        return pagination;
      } else {
        return [];
      }
    } catch (error) {
      return { error: "There was an error with the require" };
    }
  }

  async getAllProducts() {
    try {
      if (fs.existsSync(this.path)) {
        let products = JSON.parse(
          await fs.promises.readFile(this.path, "utf-8")
        );
        return products;
      } else {
        return [];
      }
    } catch (error) {
      return { error: "There was an error with the require" };
    }
  }

  async get(id) {
    try {
      let products = await this.getAllProducts();
      let product = products.find((product) => product._id == id);
      if (!product) throw new Error(`Product not found`);
      return product;
    } catch (error) {
      return { error: `${error.message}` };
    }
  }

  async create(product) {
    try {
      let products = await this.getAllProducts();
      if (this.#checkMandatoryFields(product))
        throw new Error(`All the fields are mandatory.`);
      if (this.#checkIfCodeExists(products, product.code))
        throw new Error(`The product code already exists.`);
      let _id = uuidv4();
      products.push({ _id, status: true, ...product });
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return { success: `The product was successfully added.` };
    } catch (error) {
      return { error: `${error.message}` };
    }
  }

  async update(id, newParams) {
    try {
      if (Object.keys(newParams).includes("id")) delete newParams.id;
      if (this.#checkIfEmptyField(newParams))
        throw new Error(`All the fields are mandatory.`);
      let products = await this.getAllProducts();
      products = products.map((product) => {
        if (product._id === id) product = { ...product, ...newParams };
        return product;
      });
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return products.find((product) => product.id === id);
    } catch (error) {
      return { error: error.message };
    }
  }

  async delete(id) {
    try {
      let products = await this.getAllProducts();
      let productExist = products.find((product) => product._id === id);
      if (!productExist) throw new Error(`Product doesn't exist.`);
      products.splice(products.indexOf(productExist), 1);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return { success: `The product was successfully removed` };
    } catch (error) {
      return { error: `${error.message}` };
    }
  }

  #checkIfCodeExists(products, code) {
    return products.find((product) => product.code === code);
  }

  #checkMandatoryFields(fields) {
    if (Object.keys(fields).length !== 8) return true;
    return this.#checkIfEmptyField(fields);
  }

  #checkIfEmptyField(fields) {
    for (const key in fields) {
      if (
        fields[key] === "" ||
        fields[key] === undefined ||
        fields[key] === null ||
        fields[key] === false
      )
        return true;
    }
    return false;
  }

  #createPagination(productQuantity, limit, page) {
    page = parseInt(page);
    limit = limit ? limit : 10;
    let totalPages = Math.ceil(productQuantity / limit);

    let hasPrevPage;
    let prevPage = null;
    if (page === 1) {
      hasPrevPage = false;
    } else if (totalPages >= page) {
      hasPrevPage = true;
      prevPage = page - 1;
    }

    let hasNextPage;
    let nextPage = null;
    if (page === totalPages) {
      hasNextPage = false;
    } else if (totalPages > page) {
      hasNextPage = true;
      nextPage = page + 1;
    }
    return {
      limit,
      totalPages,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    };
  }

  #orderProducts(products, sort) {
    if (sort) {
      if (sort === "asc") {
        return products.sort((a, b) => {
          return a.price - b.price;
        });
      } else {
        return products.sort((a, b) => {
          return b.price - a.price;
        });
      }
    } else {
      return products;
    }
  }

  #filterQuery(products, query) {
    let newProducts = [];
    if (query) {
      products.forEach((product) => {
        if (product.category.toLowerCase() === query) newProducts.push(product);
      });
    } else {
      newProducts = products;
    }
    return newProducts;
  }

  #productToShow(products, limit, page) {
    limit = limit ? limit : 10;
    let init = (parseInt(page) - 1) * limit;
    let end = init + limit;
    return products.slice(init, end);
  }
}
