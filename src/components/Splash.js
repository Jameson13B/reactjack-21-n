import React, { useGlobal } from "reactn";
import axios from "axios";
import blackjack_table from "../img/welcome.png";
import "../styles/Splash.css";

const Splash = props => {
  const [name, setName] = useGlobal("name");
  const [bal, setBal] = useGlobal("bal");
  const [deck] = useGlobal("deck");
  const [global, setGlobal] = useGlobal();

  const start = () => {
    axios
      .get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then(response => {
        setGlobal({
          deckId: response.data.deck_id,
          houseHand: [],
          playerHand: [],
          houseTotal: 0,
          playerTotal: 0,
          games: 0,
          active: false,
          win: 0
        });
      })
      .catch(err => console.log(`Shuffle: ${err}`));
    global.bal > 0 && global.name
      ? (document.getElementById("Splash").style.display = "none")
      : alert("Insert your name and a starting balance higher then $0");
  };

  return (
    <div id="Splash">
      <h1 className="header">Welcome to ReactJack 21</h1>
      <img src={""} alt="" />
      <p>
        ReactJack 21 is an online web app created using React.JS, vanilla CSS,
        and the{" "}
        <a
          href="http://deckofcardsapi.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Deck of Cards API
        </a>
      </p>
      <p>
        If you dont know how to play,{" "}
        <a href="https://www.bicyclecards.com/how-to-play/blackjack/">
          learn here
        </a>
      </p>
      <div className="name">
        <h1>What is your name? </h1>
        <input
          name="name"
          value={name}
          placeholder="Player"
          onChange={e => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="bank">
        <h1>Starting Balance? </h1>
        <input
          name="bal"
          value={bal}
          placeholder="Balance"
          onChange={e => {
            setBal(e.target.value);
          }}
        />
      </div>
      <div className="start" onClick={start}>
        Start New
      </div>
      {deck ? (
        <div
          className="start"
          onClick={() =>
            (document.getElementById("Splash").style.display = "none")
          }
        >
          Resume
        </div>
      ) : (
        "Good Luck"
      )}
    </div>
  );
};

export default Splash;
