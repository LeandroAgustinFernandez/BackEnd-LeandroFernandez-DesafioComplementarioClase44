export default class CartRepository {
  constructor(DAO) {
    this.DAO = DAO;
  }

  async addCart() {
    return await this.DAO.create();
  }

  async getCart(id) {
    return await this.DAO.get(id);
  }

  async addProductToCart(cid, pid) {
    return await this.DAO.addProductToCart(cid, pid);
  }

  async deleteAllProducts(id) {
    return await this.DAO.deleteAllProducts(id);
  }

  async deleteProduct(cid, pid) {
    return await this.DAO.deleteProduct(cid, pid);
  }

  async updateProducts(cid, products) {
    return await this.DAO.updateProducts(cid, products);
  }

  async updateProductQuantity(cid, pid, quantity) {
    return await this.DAO.updateProducts(cid, pid, quantity);
  }
}
