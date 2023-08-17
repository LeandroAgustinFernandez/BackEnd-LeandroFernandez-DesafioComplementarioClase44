import { Schema, model } from "mongoose";

const messagesCollection = "messages";

const messageSchema = new Schema({
  user: { type: String, require: true },
  message: { type: String, require: true },
  id: { type: String, require: true },
});

export const messageModel = model(messagesCollection, messageSchema);
