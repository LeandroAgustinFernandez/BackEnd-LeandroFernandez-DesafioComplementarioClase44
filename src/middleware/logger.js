import winston from "winston";
import config from "../config/config.js";

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2, 
    info: 3, 
    http: 4, 
    debug: 5, 
  },
  colors: {
    fatal: "red",
    error: "red",
    warning: "yellow",
    info: "green",
    http: "blue", 
    debug: "blue",
  },
};

// const logger = winston.createLogger({
//   transports: [
//     new winston.transports.Console({
//       level: "debug",
//     }),
//     new winston.transports.File({
//       filename: "logs/dev.log",
//     }),
//   ],
// });

let levelState = config.loggerType === "production" ? "info" : "debug";

const logger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: levelState,
      format: winston.format.combine(
        winston.format.colorize({
          all: true,
          colors: customLevelsOptions.colors,
        }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      level: "error",
      filename: "logs/errors.log",
    }),
  ],
});

export const addLogger = (request, response, next) => {
  request.logger = logger;
  request.logger.info(
    `${request.method} en ${request.url} - ${new Date().toISOString()}`
  );
  next();
};
