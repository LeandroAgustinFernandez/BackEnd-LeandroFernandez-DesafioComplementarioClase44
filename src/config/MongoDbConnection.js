// ? Mongoose
import mongoose from "mongoose";
import config from "./config.js";

export default class MongoDbConnection {
  static #instance;

  constructor() {
    mongoose.connect(config.mongoUrl);
  }

  static getConnection() {
    try {
      if (this.#instance) {
        console.log(`Ya existe la conexion`);
        return this.#instance;
      }
      this.#instance = new MongoDbConnection();
      console.log(`Base de datos conectada`);
    } catch (error) {
      console.log(error.message);
    }
  }
}