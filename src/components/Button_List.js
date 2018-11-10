import React, { useGlobal } from "reactn";
import Button from "./Button";
import "../styles/Button_List.css";

const ButtonList = props => {
  const [global] = useGlobal();
  return (
    <div className="ButtonList">
      <Button
        handler={() =>
          (document.getElementById("Splash").style.display = "flex")
        }
        content="Menu"
        size="small"
      />
      <Button handler={() => window.close()} content="Quit" size="small" />
      <Button handler={props.handleHit} content="Hit" size="big" />
      {global.active ? (
        <Button handler={props.handleStand} content="Stand" size="big" />
      ) : (
        <Button
          handler={props.handleDeal}
          content="Deal"
          size="big"
          active="active"
        />
      )}
    </div>
  );
};

export default ButtonList;
