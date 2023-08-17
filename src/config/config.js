import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.env.NODE_ENV + ".env"),
});

const URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@coderhousecluster.phsl88g.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

export default {
  mongoUrl: URL,
  jwtPrivate: process.env.JWT_PRIVATE_KEY,
  persistence: process.env.PERSISTENCE,
  loggerType: process.env.LOGGER,
  emailApp: process.env.APP_EMAIL
};
