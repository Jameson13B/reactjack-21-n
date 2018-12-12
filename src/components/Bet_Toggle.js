import React, { useGlobal } from "reactn";
import "../styles/Bet_Toggle.css";

const BetToggle = props => {
  const [active, setActive] = useGlobal("active");
  const [bal, setBal] = useGlobal("bal");
  const [bet, setBet] = useGlobal("bet");

  const handleIncrease = () => {
    if (!active) {
      if (bal >= 5) {
        setBal(bal - 5);
        setBet(bet + 5);
      }
    }
  };
  const handleDecrease = () => {
    if (!active) {
      if (bet > 0) {
        setBet(bet - 5);
        setBal(bal + 5);
      }
    }
  };
  return (
    <div className="BetToggle">
      <div className="betBtn" onClick={handleDecrease}>
        {" "}
        -{" "}
      </div>
      <h1 className="font">Bet</h1>
      <div className="betBtn" onClick={handleIncrease}>
        {" "}
        +{" "}
      </div>
    </div>
  );
};

export default BetToggle;
