"use strict";

const express = require("express");
const router = express.Router();

const busboy = require("busboy");
const GetAbl = require("../abl/book-image/get-abl");
const CreateAbl = require("../abl/book-image/create-abl");

router.get("/get", async (request, response) => {
  const { query } = request;
  await GetAbl(query, response);
});

router.post("/create", (request, response) => {
  let bb = busboy({ headers: request.headers, limits: { files: 1 } });
  CreateAbl(bb, response);
  request.pipe(bb);
});

module.exports = router;
