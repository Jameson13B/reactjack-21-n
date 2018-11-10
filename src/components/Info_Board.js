import React, { useGlobal } from "reactn";
import "../styles/Info_Board.css";

const InfoBoard = () => {
  const [bal] = useGlobal("bal");
  const [bet] = useGlobal("bet");
  const [win] = useGlobal("win");
  return (
    <div className="InfoBoard">
      <div className="element">
        <h1>Bal:</h1>
        <p>$ {bal}</p>
      </div>
      <div className="element">
        <h1>Bet:</h1>
        <p>$ {bet}</p>
      </div>
      <div className="element">
        <h1>+/-:</h1>
        <p>$ {win}</p>
      </div>
    </div>
  );
};

export default InfoBoard;
