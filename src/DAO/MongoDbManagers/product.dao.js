import { productModel } from "../models/product.model.js";

export default class ProductManagerDB {
  
  async getAll(limit, page = 1, query = false, sort = false) {
    try {
      if (isNaN(page)) throw new Error(`La pagina especificada no existe`);
      let options = { lean: true, limit: limit || 10, page };
      if (sort) options.sort = { price: sort };
      let queryObj = query ? { category: { $regex: query, $options: "i" } } : {};
      let products = await productModel.paginate(queryObj, options);
      if (page > products.totalPages || page <= 0 )
      throw new Error(`La pagina especificada no existe`);
      return products;
    } catch (error) {
      return { error: error.message };
    }
  }

  async get(id) {
    try {
      let product = await productModel.findOne({ _id: id }).lean();
      if (!product) throw new Error(`Product not found`);
      return product;
    } catch (error) {
      return { error: `${error.message}` };
    }
  }

  async create(product) {
    try {
      if (this.#checkMandatoryFields(product))
        throw new Error(`All the fields are mandatory.`);
      if (await this.#checkIfCodeExists(product.code))
        throw new Error(`The product code already exists.`);
      let result = await productModel.create(product);
      return { success: `The product was successfully added.`, payload: result };
    } catch (error) {
      return { error: `${error.message}` };
    }
  }
  
  async update(id, newParams) {
    try {
      if (this.#checkIfEmptyField(newParams))
        throw new Error(`All the fields are mandatory.`);
      let result = await productModel.updateOne({ _id: id }, newParams);
      return { success: `The product was update succefully`, payload: result };
    } catch (error) {
      return { error: error.message };
    }
  }

  async delete(id) {
    try {
      let result = await productModel.deleteOne({ _id: id });
      return { success: `The product was successfully removed`, payload: result };
    } catch (error) {
      return { error: `${error.message}` };
    }
  }

  async #checkIfCodeExists(code) {
    let exists = await productModel.findOne({ code: code });
    return exists;
  }

  #checkMandatoryFields(fields) {
    if (Object.keys(fields).length !== 9) return true;
    return this.#checkIfEmptyField(fields);
  }

  #checkIfEmptyField(fields) {
    for (const key in fields) {
      if (
        fields[key] === "" ||
        fields[key] === undefined ||
        fields[key] === null
      )
        return true;
    }
    return false;
  }
}
