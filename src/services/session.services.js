import { USER_REPOSITORY } from "../repository/repositoryManager.js";

export default class SessionServices {
  getUser = async (email) => await USER_REPOSITORY.getUser(email);
  saveUser = async (user) => await USER_REPOSITORY.register(user);
  changePassword = async ({ email, newpassword }) =>
    await USER_REPOSITORY.resetPassword({ email, newpassword });
  recoverPassword = async (user) => await USER_REPOSITORY.recoverPassword(user)
  checkResetUrl = async (idurl) => await USER_REPOSITORY.checkResetUrl(idurl)
  resetRecoverPassword = async (email) => await USER_REPOSITORY.resetRecoverPassword(email)
  changeRole = async (uid) => await USER_REPOSITORY.changeRole(uid)
}
