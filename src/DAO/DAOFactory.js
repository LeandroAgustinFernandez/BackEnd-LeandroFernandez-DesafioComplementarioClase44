import config from '../config/config.js';

const persistence = config.persistence

let PRODUCT_DAO;
let USER_DAO;
let CART_DAO;
let TICKET_DAO;
let MESSAGE_DAO;

switch (persistence) {
    case 'MONGO':
        console.log('Trabajando con MongoDB');    
        const { default: MongoDbConnection } = await import ('../config/MongoDbConnection.js');
        MongoDbConnection.getConnection();
        let { default: ProductManagerDB } = await import ("./MongoDbManagers/product.dao.js");
        let { default: UserManagerDB } = await import ("./MongoDbManagers/user.dao.js");
        let { default: CartManagerDB } = await import ("./MongoDbManagers/cart.dao.js");
        let { default: TicketManagerDB } = await import ("./MongoDbManagers/ticket.dao.js");
        let { default: MessageManagerDB } = await import ("./MongoDbManagers/message.dao.js");

        PRODUCT_DAO = new ProductManagerDB();
        USER_DAO = new UserManagerDB();
        CART_DAO = new CartManagerDB();
        TICKET_DAO = new TicketManagerDB();
        MESSAGE_DAO = new MessageManagerDB();

        break;
    case 'FILES':
        console.log('Trabajando con FILES');    
        const { default: CartManagerFiles } = await import ("./FileSystemaManangers/cart.dao.js");
        const { default: ProductManagerFiles } = await import ("./FileSystemaManangers/product.dao.js");
        const { default: TicketManagerFiles } = await import ("./FileSystemaManangers/ticket.dao.js");
        const { default: UserManagerFiles } = await import ("./FileSystemaManangers/user.dao.js");
        const { default: MessageManagerFiles } = await import ("./FileSystemaManangers/message.dao.js");

        PRODUCT_DAO = new ProductManagerFiles();
        USER_DAO = new UserManagerFiles();
        CART_DAO = new CartManagerFiles();
        TICKET_DAO = new TicketManagerFiles();
        MESSAGE_DAO = new MessageManagerFiles();

        break;
}

export { PRODUCT_DAO, USER_DAO, CART_DAO, TICKET_DAO, MESSAGE_DAO };