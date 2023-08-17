import { MESSAGE_SERVICES } from "../services/servicesManager.js";

export const saveMessage = async (request, response) => {
  const io = request.app.get("socketio");
  let { user, message, id } = request.body; 
  await MESSAGE_SERVICES.saveMessage({ user, message, id });
  response.send({ ...request.body });
  let messages = await MESSAGE_SERVICES.getMessages();
  io.emit("messageLogs", messages);
};
