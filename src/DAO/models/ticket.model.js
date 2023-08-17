import { Schema, model } from "mongoose";

const ticketsCollection = "tickets";

const ticketsSchema = new Schema({
  code: { type: String, require: true, unique: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, require: true },
  purchaser: { type: String, require: true },
});

export const ticketModel = model(ticketsCollection, ticketsSchema);
