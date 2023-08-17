import SessionServices from "./session.services.js";
import CartServices from "./cart.services.js";
import ProductServices from "./product.services.js";
import TicketServices from "./ticket.services.js";
import MessageServices from "./message.services.js";

const SESSION_SERVICES = new SessionServices();
const CART_SERVICES = new CartServices();
const PRODUCT_SERVICES = new ProductServices();
const TICKET_SERVICES = new TicketServices();
const MESSAGE_SERVICES = new MessageServices();

export { SESSION_SERVICES, CART_SERVICES, PRODUCT_SERVICES, TICKET_SERVICES, MESSAGE_SERVICES }