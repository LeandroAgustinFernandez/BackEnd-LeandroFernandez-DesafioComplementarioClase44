import { TICKET_REPOSITORY } from "../repository/repositoryManager.js";

export default class TicketServices {
  createTicket = async (ticket) => await TICKET_REPOSITORY.createTicket(ticket);
}
