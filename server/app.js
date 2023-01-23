"use strict";

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bookRouter = require("./controller/book-controller");
const bookImageRouter = require("./controller/book-image-controller");

const loggerFactory = require("./component/logger-factory");
loggerFactory.setLevel("INFO");

const loggingMiddleware = require("./middleware/logging-middleware");

const port = 3000;
const app = express();

// app.use(express.static(path.join(__dirname, "build")));
// app.get("/", (request, response) => {
//   response.sendFile(path.join(__dirname, "build", "index.html"));
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggingMiddleware);
app.use(cookieParser());
app.use("/book", bookRouter);
app.use("/bookImage", bookImageRouter);

app.listen(port, () => {
  console.log(`The Express server is listening on port ${port}`);
});
