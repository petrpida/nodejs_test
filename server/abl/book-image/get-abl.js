"use strict";

const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;
const { getBookImageSchema } = require("../../schemas/book-image-schema");

async function GetAbl(query, response) {
  const ajv = new Ajv();
  const valid = ajv.validate(getBookImageSchema, query);

  if (!valid) {
    response.status(400).json({ error: ajv.errors });
  }

  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "storage",
    `${query.code}.png`
  );

  try {
    await fs.promises.access(filePath, fs.F_OK);
  } catch (e) {
    response
      .status(400)
      .json({ error: `Book with code ${query.code} doesn't exist.` });
  }

  response.sendFile(filePath);
}

module.exports = GetAbl;
