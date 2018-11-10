import React, { setGlobal } from "reactn";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";

setGlobal({
  name: "",
  houseTotal: 0,
  playerTotal: 0,
  bal: "",
  bet: 0,
  win: 0,
  houseHand: [],
  playerHand: [],
  active: false,
  deckId: 0,
  games: 0,
  playerAce: false
});

ReactDOM.render(<App />, document.getElementById("root"));
