import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { __dirname } from "../../utils.js";

export default class MessageManagerFiles {
  constructor() {
    this.path = "./src/DAO/FSyFiles/messages.json";
  }

  async getAll() {
    try {
      if (fs.existsSync(this.path)) {
        let messages = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(messages);
      } else {
        return [];
      }
    } catch (error) {
      return { error: "There was an error with the require" };
    }
  }

  async create(data) {
    let messages = await this.getAll();
    let _id = uuidv4();
    let { user, message, id } = data;
    messages.push({ _id, user, message, id });
    await fs.promises.writeFile(this.path, JSON.stringify(messages, null, 2));
    return messages;
  }
}
