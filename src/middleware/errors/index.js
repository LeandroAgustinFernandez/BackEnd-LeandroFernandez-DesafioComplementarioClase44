import EErrors from "./enum.js";

export default (error, request, response, next) => {
  switch (error.code) {
    case EErrors.INVALID_TYPE_ERROR:
      response.status(400).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
      break;
    case EErrors.ID_NOT_FOUND:
      response.status(404).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
      break;
    default:
      response.status(500).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
      break;
  }
  next();
};