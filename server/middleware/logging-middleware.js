"use strict";

const loggerFactory = require("../component/logger-factory");

let logger = loggerFactory.getLogger("middleware.logging-middleware");

function loggingMiddleware(request, response, next) {
  let date = new Date();
  logger.info(`${request.method} = ${request.url} - ${date.toISOString()}`);

  next();
}

module.exports = loggingMiddleware;
