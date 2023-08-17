export default class MessageRepository {
  constructor(DAO) {
    this.DAO = DAO;
  }

  async saveMessage(data) {
    return await this.DAO.create(data);
  }

  async getMessages() {
    return await this.DAO.getAll();
  }
}
