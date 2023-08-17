import { PRODUCT_DTO } from "../DTO/DTOManager.js";

export default class ProductRepository {
  constructor(DAO) {
    this.DAO = DAO;
  }

  async getProducts(limit, page, query, sort) {
    return await this.DAO.getAll(limit, page, query, sort);
  }

  async getProduct(id) {
    return await this.DAO.get(id);
  }

  async addProduct(product) {
    let productDBFormat = await PRODUCT_DTO.product(product);
    return await this.DAO.create(productDBFormat);
  }

  async updateProduct(id, newParams) {
    return await this.DAO.update(id, newParams);
  }

  async deleteProduct(id) {
    return await this.DAO.delete(id);
  }
}
