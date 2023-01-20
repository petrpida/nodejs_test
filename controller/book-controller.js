"use strict";

const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/book/get-abl");
const CreateAbl = require("../abl/book/create-abl");
const ListAbl = require("../abl/book/list-abl");

router.get("/get", async (request, response) => {
  const { query, cookies } = request;
  await GetAbl(query, cookies, response);
});

router.get("/list", async (request, response) => {
  await ListAbl(response);
});

router.post("/create", async (request, response) => {
  const { body } = request;
  await CreateAbl(body, response);
});

module.exports = router;
