import { USER_DTO } from "../DTO/DTOManager.js";

export default class UserRepository {
  constructor(DAO) {
    this.DAO = DAO;
  }

  async register(user) {
    let userDBFormat = await USER_DTO.user(user);
    return await this.DAO.create(userDBFormat);
  }

  async getUser(email) {    
    return await this.DAO.get(email);
  }

  async resetPassword({ email, newpassword }) {
    return await this.DAO.updatePassword({ email, newpassword });
  }

  async recoverPassword(user) {
    // console.log('USER_REPOSITORY=>',user);
    return await this.DAO.recoverPassword(user)
  }

  async checkResetUrl(idurl) {
    return await this.DAO.checkResetUrl(idurl)
  }

  async resetRecoverPassword(email) {
    return await this.DAO.resetRecoverPassword(email);
  }

  async changeRole(uid) {
    return await this.DAO.changeRole(uid);
  }
}
