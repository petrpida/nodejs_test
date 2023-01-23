"use strict";

const getBookSchema = {
  type: "object",
  properties: {
    code: { type: "string" },
  },
  required: ["code"],
};
const createBookSchema = {
  type: "object",
  properties: {
    code: { type: "string" },
    title: { type: "string" },
    author: { type: "string" },
  },
  required: ["code", "title"],
};

const listBookSchema = {
  type: "object",
};

module.exports = {
  getBookSchema,
  createBookSchema,
  listBookSchema,
};
