// ? Utils config
import { __dirname, PORT } from "./utils.js";
// // ? DB Connection
// import MongoDbConnection from "./config/MongoDbConnection.js";
// ? Archivos de rutas.
import CartRouterClass from "./routes/cart.router.js";
import ProductsRouterClass from "./routes/product.router.js";
import ViewsRouterClass from "./routes/view.router.js";
import SessionRouterClass from "./routes/session.router.js";
import MessageRouterClass from './routes/message.router.js';
import LoggerRouterClass from './routes/logger.router.js';
// ? Handlebars 
import handlebars from "express-handlebars";
// ? Express
import express from "express";
// ? CORS
import cors from "cors";
// ? SocketIO
import { Server } from "socket.io";
// ? Cookies
import cookieParser from "cookie-parser";
// ? Passport
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { MESSAGE_SERVICES } from "./services/servicesManager.js";
import dotenv from 'dotenv';
// import errorHandler from './middleware/errors/index.js'
import { addLogger } from "./middleware/logger.js";
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

dotenv.config();
// MongoDbConnection.getConnection();

const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info:{
      title: 'E commerce',
      description: 'E-Commerce de productos de indumentaria de Leandro Fernandez'
    }
  },
  apis: [`${__dirname}/docs/*/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions)
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

const viewsRouter = new ViewsRouterClass();
const cartRouter = new CartRouterClass();
const sessionRouter = new SessionRouterClass();
const productRouter = new ProductsRouterClass();
const messageRouterClass = new MessageRouterClass()
const loggerRouter = new LoggerRouterClass()

initializePassport();
app.use(passport.initialize());
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.use(addLogger);
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter.getRouter());
app.use("/api/session", sessionRouter.getRouter());
app.use("/api/carts", cartRouter.getRouter());
app.use("/api/chat", messageRouterClass.getRouter());
app.use("/api/products", productRouter.getRouter());
app.use("/api/logger", loggerRouter.getRouter());

// app.use("/api/products", ProductsRouterClass);
// app.all(errorHandler);

const socketio = app.listen(PORT, () =>
console.log(`Server running at http://localhost:${PORT}`)
);

const io = new Server(socketio);
app.set("socketio", io);

io.on("connection", (socket) => {  
  socket.on("newuser", async ({ user }) => {
    socket.broadcast.emit("newuserconnected", { user: user });
    let messages = await MESSAGE_SERVICES.getMessages();
    io.emit("messageLogs", messages);
  });
});
