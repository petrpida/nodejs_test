"use strict";

const path = require("path");
const LibraryDao = require("../../dao/library-dao");
const dao = new LibraryDao(
  path.join(__dirname, "..", "..", "storage", "books.json")
);

const Ajv = require("ajv").default;
const { listBookSchema } = require("../../schemas/book-schemas");

async function ListAbl(response) {
  const ajv = new Ajv();
  const valid = ajv.validate(listBookSchema, response);

  if (!valid) {
    response.status(400).json({ error: ajv.errors });
  }

  const listOfBooks = await dao.loadAllBooks();

  response.json(listOfBooks);
}

module.exports = ListAbl;
