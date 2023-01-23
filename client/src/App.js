import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  let [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    fetch("/book/list")
      .then((response) => response.json())
      .then((data) => {
        setFetchedData(data);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello hello world!</p>
        <>
          {fetchedData.map((book) => {
            return (
              <p
                key={book.code}
              >{`code: ${book.code}, title: ${book.title}, author: ${book.author}`}</p>
            );
          })}
        </>
      </header>
    </div>
  );
}

export default App;
