"use strict";

const path = require("path");
const LibraryDao = require("../../dao/library-dao");
const dao = new LibraryDao(
  path.join(__dirname, "..", "..", "storage", "books.json")
);

const Ajv = require("ajv").default;
const { getBookSchema } = require("../../schemas/book-schemas");

async function GetAbl(query, cookies, response) {
  const ajv = new Ajv();
  const valid = ajv.validate(getBookSchema, query);

  if (!valid) {
    return response.status(400).json({ error: ajv.errors });
  }

  const bookCode = query.code;
  const book = await dao.getBook(bookCode);

  if (!book) {
    return response
      .status(400)
      .json({ error: `Book with code ${bookCode} doesn't exist.` });
  }

  // load cookies
  let visitedBooks = cookies["visitedBooks"] || [];
  // if current visited book hasn't been visited before, add it to the array of visited books
  if (visitedBooks.indexOf(bookCode) === -1) {
    visitedBooks.push(bookCode);
  }

  // returned cookies with all visited books
  response.cookie("visitedBooks", visitedBooks);
  // returned values of book and all visited books
  response.json({ book, visitedBooks });
}

module.exports = GetAbl;
