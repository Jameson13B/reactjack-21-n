import React, { useGlobal } from "reactn";
import "../styles/Splash.css";

const Splash = props => {
  const [name] = useGlobal("name");
  const [bal] = useGlobal("bal");
  const [deck] = useGlobal("deck");
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
          onChange={props.handleInputChange}
        />
      </div>
      <div className="bank">
        <h1>Starting Balance? </h1>
        <input
          name="bal"
          value={bal}
          placeholder="Balance"
          onChange={props.handleInputChange}
        />
      </div>
      <div className="start" onClick={props.start}>
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
