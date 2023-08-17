import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { __dirname } from "../../utils.js";

export default class UserManagerFiles {
  constructor() {
    this.path = "./src/DAO/FSyFiles/users.json";
  }

  async getAll() {
    try {
      let users = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(users);
    } catch (error) {
      return { error: "There was an error with the require" };
    }
  }

  async get(email) {
    try {
      let users = await this.getAll();
      let user = users.find((user) => user.email === email);
      if(!user) throw new Error('User not found');
      return user;
    } catch (error) {
      return { error: error.message };
    }
  }

  async create(userInfo) {
    try {
      let users = await this.getAll();
      let user = users.find((user) => user.email === userInfo.email);
      if (user) throw new Error(`The email already exists.`);
      users.push({ _id: uuidv4(), ...userInfo });
      await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2));
      return user;
    } catch (error) {
      return { error: error.message };
    }
  }

  async updatePassword({ email, newpassword }) {
    try {
      let users = await this.getAll();
      let userInfo = users.find((user) => user.email === email);
      if (!userInfo) throw new Error(`User does not exists.`);
      users = users.map((user) => {
        if (user.email === userInfo.email)
          user = { ...user, password: newpassword };
        return user;
      });
      await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2));
      return users.find((user) => user.email === email);
    } catch (error) {
      return { error: error.message };
    }
  }
}
