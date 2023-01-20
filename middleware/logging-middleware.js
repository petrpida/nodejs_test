"use strict";

const loggerFactory = require("../component/logger-factory");
const logLevel = require("../component/log-level");

let logger = loggerFactory.getLogger("middleware.logging-middleware");

function loggingMiddleware(request, response, next) {
  let date = new Date();
  logger.info(`${request.method} = ${request.url} - ${date.toISOString()}`);

  next();
}

module.exports = loggingMiddleware;
