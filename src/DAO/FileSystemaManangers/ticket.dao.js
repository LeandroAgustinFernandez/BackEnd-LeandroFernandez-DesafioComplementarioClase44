import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import { __dirname } from "../../utils.js";

export default class TicketManagerFiles {
  constructor() {
    this.path = "./src/DAO/FSyFiles/tickets.json";
  }

  async getAll(){
    try {
      if (fs.existsSync(this.path)) {
        let tickets = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(tickets)
      } else {
        return [];
      }
    } catch (error) {
      return { error: "There was an error with the require" };
    }
  }

  async addTicket(ticket) {
    try {
      let tickets = await this.getAll();
      ticket._id = uuidv4();
      ticket.code = uuidv4();
      tickets.push(ticket);
      await fs.promises.writeFile(this.path, JSON.stringify(tickets, null, 2));
      return { success: `The ticket was successfully created.` };
    } catch (error) {
      return { error: error.message };
    }
  }
}
