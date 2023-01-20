"use strict";
const fs = require("fs");
const path = require("path");

const readFile = fs.promises.readFile;
const writeFile = fs.promises.writeFile;

// 1 (V případě, že by cesta nebyla uvedena při vytváření instance třídy, použije se výchozí hodnota
//    odpovídající relativní adrese oproti tomuto souboru ./storage/books.json.)
const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "books.json");

class LibraryDao {
  constructor(storagePath) {
    this.bookStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  // 2 (Metoda getBook přijímá code jako jediný parametr, na základě něhož
  //    navrátí knihu. Pokud by kniha nebyla nalezena, navrátí undefined.)
  async getBook(code) {
    let books = await this.loadAllBooks();
    return books.find((book) => book.code === code);
  }

  // 3 (Metoda addBook slouží k ukládání knihy. Knihu přijímá v podobě objectu, kterou dostane jako parametr.
  //    Před uložením knihy je ještě ověřeno, zda již neexistuje kniha se stejným code.)
  async addBook(book) {
    let books = await this.loadAllBooks();
    if (this._isDuplicate(books, book.code)) {
      let e = new Error(`Book with code ${book.code} already exists.`);
      e.code = "DUPLICATE_CODE";
      throw e;
    }

    books.push(book);

    try {
      await writeFile(
        this._getStorageLocation(),
        JSON.stringify(books, null, 2)
      );
      return { status: "OK", data: book };
    } catch (e) {
      return { status: "ERROR", error: e };
    }
  }

  // 4 (Privátní metoda _loadAllBooks slouží k načtení všech knih. Je využívána jak v případě vyhledávání
  //    konkrétní knihy, tak i v případě ukládání knihy pro ověření, že nebude uložena kniha se stejným code.)
  async loadAllBooks() {
    let books;
    try {
      books = JSON.parse(await readFile(this._getStorageLocation()));
    } catch (e) {
      if ((e.code = "ENOENT")) {
        console.info("No storage found, initializing new one...");
        books = [];
      } else {
        throw new Error(
          "Unable to read from storage. Wrong data format. " +
            this._getStorageLocation()
        );
      }
    }
    return books;
  }

  _isDuplicate(books, code) {
    let result = books.find((book) => {
      return book.code === code;
    });
    return !!result;
  }

  _getStorageLocation() {
    return this.bookStoragePath;
  }
}

module.exports = LibraryDao;
