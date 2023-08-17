import CartRepository from "./cart.repository.js";
import ProductRepository from "./product.repository.js";
import TicketRepository from "./ticket.repository.js";
import UserRepository from "./user.repository.js";
import MessageRepository from "./message.repository.js";

import { CART_DAO, MESSAGE_DAO, PRODUCT_DAO, TICKET_DAO, USER_DAO } from "../DAO/DAOFactory.js";

const CART_REPOSITORY = new CartRepository(CART_DAO);
const PRODUCT_REPOSITORY = new ProductRepository(PRODUCT_DAO);
const TICKET_REPOSITORY = new TicketRepository(TICKET_DAO);
const USER_REPOSITORY = new UserRepository(USER_DAO);
const MESSAGE_REPOSITORY = new MessageRepository(MESSAGE_DAO);

export { CART_REPOSITORY, PRODUCT_REPOSITORY, TICKET_REPOSITORY, USER_REPOSITORY, MESSAGE_REPOSITORY }