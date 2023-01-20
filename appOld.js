"use strict";
const express = require("express");
const LibraryDao = require("./dao/library-dao.js");

const dao = new LibraryDao("./storage/books.json");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1 (Deklarace routy /book/get, která je dostupná pod GET metodou. Parametr code
//    pro vyhledání je předán jako query parametr. Pokud není code uveden, je navrácená chyba.
//    Pokud code je uveden, zavolá se metoda getBook z instance třídy LibraryDao, která slouží
//    k vyhledání konkrétní knížky. Následně se ověří, zda je hodnota uvedena, či ne.
//    Podle toho je buďto navrácená kniha, anebo chyba s iformací o tom, že kniha neexistuje.)

app.get("/book/get", async (request, response) => {
  const { query } = request;
  const bookCode = Number(query.code);
  if (!bookCode) {
    return response
      .status(400)
      .json({ error: "Invalid input: code parameter is missing." });
  }
  const book = await dao.getBook(bookCode);

  if (!book) {
    return response
      .status(400)
      .json({ error: `Book with code ${bookCode} doesn't exist.` });
  }
  response.json(book);
});

// 2 (Deklarace routy /book/create, která je dostupná pod POST metodou. Obdobně jako v případě
//    routy /book/get se ověří parametry, které se v tomto případě nachází v body. Následně se
//    pokusí uložit knihu pomocí metody createBook z instance třídy LibraryDao. Tato metoda může
//    vyhodit chybu, proto máme uložené obalené do try catch bloku, abychom mohli chybu odchytit
//    a na základě chyby rozhodnout, zda to je způsobené chybou uživatele, protože se pokusil uložit
//    knihu s duplicitní hodnotou code, anebo to je chyba z procesu ukládání. Pokud nenastala chyba,
//    je navrácena kniha, která byla uložena.)

app.post("/book/create", async (request, response) => {
  const { body } = request;

  if (!body.code || !body.title || !body.author) {
    return response
      .status(400)
      .json({ error: "Invalid input: code parameter is missing." });
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
  response.json(book);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000.");
});
