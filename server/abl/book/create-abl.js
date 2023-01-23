"use strict";

const path = require("path");
const LibraryDao = require("../../dao/library-dao");
const dao = new LibraryDao(
  path.join(__dirname, "..", "..", "storage", "books.json")
);

const Ajv = require("ajv").default;
const { createBookSchema } = require("../../schemas/book-schemas");

async function CreateAbl(body, response) {
  // if (!body.code || !body.title || !body.author) {
  //   return response
  //     .status(400)
  //     .json({ error: "Invalid input: code parameter is missing." });
  // }
  const ajv = new Ajv();
  const valid = ajv.validate(createBookSchema, body);

  if (!valid) {
    return response.status(400).json({ error: ajv.errors });
  }

  const book = {
    code: body.code,
    title: body.title,
    author: body.author,
  };

  try {
    await dao.addBook(book);
  } catch (e) {
    if (e.code === "DUPLICATE_CODE") {
      response.status(400);
    } else {
      response.status(500);
    }
    return response.json({ error: e.message });
  }
  return response.json(book);
}

module.exports = CreateAbl;
