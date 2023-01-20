"use strict";

const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;
const LibraryDao = require("../../dao/library-dao");
const dao = new LibraryDao(
  path.join(__dirname, "..", "..", "storage", "books.json")
);
const { createBookImageSchema } = require("../../schemas/book-image-schema");

async function CreateAbl(busboy, response) {
  let dtoIn = {};

  busboy.on("field", function (fieldname, val) {
    dtoIn[fieldname] = val;
  });

  busboy.on("file", async function (fieldname, file, filename) {
    const ajv = new Ajv();
    const valid = ajv.validate(createBookImageSchema, dtoIn);

    if (!valid) {
      response.status(400).json({ error: ajv.errors });
    }

    const book = await dao.getBook(dtoIn.code);
    if (!book) {
      response
        .status(400)
        .json({ error: `Book with code ${dtoIn.code} doesn't exist.` });
    }

    if (filename.mimeType !== "image/png") {
      response
        .status(400)
        .json({ error: `The only supported mimetype is image/png.` });
    }

    let saveTo = path.join(
      __dirname,
      "..",
      "..",
      "storage",
      `${dtoIn.code}.png`
    );
    let writeStream = fs.createWriteStream(saveTo);
    file.pipe(writeStream);
  });

  busboy.on("finish", function () {
    response.json({
      status: `The picture for book with code ${dtoIn.code} has been successfully loaded.`,
    });
  });

  busboy.on("error", function (e) {
    response.json({ error: e });
  });
}

module.exports = CreateAbl;
