import React, { useGlobal } from "reactn";
import Button from "./Button";
import axios from "axios";
import "../styles/Button_List.css";

const ButtonList = props => {
  const [global, setGlobal] = useGlobal();
  const [houseTotal, setHouseTotal] = useGlobal("houseTotal");
  const [playerTotal, setPlayerTotal] = useGlobal("playerTotal");
  const [bal, setBal] = useGlobal("bal");
  const [bet, setBet] = useGlobal("bet");
  const [win, setWin] = useGlobal("win");
  const [houseHand, setHouseHand] = useGlobal("houseHand");
  const [playerHand, setPlayerHand] = useGlobal("playerHand");
  const [active, setActive] = useGlobal("active");
  const [deckId, setDeckId] = useGlobal("deckId");
  const [games, setGames] = useGlobal("games");
  const [playerAce, setPlayerAce] = useGlobal("playerAce");

  const handleDeal = () => {
    console.log("handleDeal");
    if (games === 3) {
      axios
        .get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then(response => {
          setDeckId(response.data.deck_id);
          setGames(1);
        })
        .catch(err => console.log(`Shuffle: ${err}`));
    }
    axios
      .get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`)
      .then(response => {
        setHouseHand([
          response.data.cards[0].image,
          response.data.cards[2].image
        ]);
        setHouseTotal(
          handleValue(response.data.cards[0].value, "house") +
            handleValue(response.data.cards[2].value, "house")
        );
        setPlayerHand([
          response.data.cards[1].image,
          response.data.cards[3].image
        ]);
        setPlayerTotal(
          handleValue(response.data.cards[1].value, "player") +
            handleValue(response.data.cards[3].value, "player")
        );
        handleAce(response.data.cards[1].value);
        handleAce(response.data.cards[3].value);
        setGames(games + 1);
        setActive(true);
        setWin(0);
        if (houseTotal === 21 && playerTotal < 22 && active) {
          console.log("House 21");
          handleLose();
        } else if (playerTotal === 21 && active) {
          console.log("Player 21");
          setBet(bet + bet / 2);
          handleWin();
        }
        console.log("Global: ", global);
      })
      .catch(err => console.log(`Deal: ${err}`));
  };
  const handleHit = () => {
    console.log("handleHit");
    if (active) {
      axios
        .get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        .then(response => {
          handleAce(response.data.cards[0].value);
          const playerArr = playerHand.slice();
          playerArr.push(response.data.cards[0].image);
          setPlayerHand(playerArr);
          setPlayerTotal(
            playerTotal + handleValue(response.data.cards[0].value)
          );
          if (playerTotal > 21 && playerAce) {
            setPlayerTotal(playerTotal - 10);
            setPlayerAce(false);
          } else if (playerTotal > 21) {
            handleLose();
          }

          console.log("Global: ", global);
        })
        .catch(err => console.log(`Hit: ${err}`));
    }
  };
  const handleStand = () => {
    console.log("handleStand");
    if (houseTotal < 17 && active) {
      handleHouse().then(handleStand);
    } else if (playerTotal === houseTotal) {
      handlePush();
    } else if (playerTotal > houseTotal || houseTotal > 21) {
      handleWin();
    } else {
      handleLose();
    }
    console.log("Global: ", global);
  };

  // Support Functions
  const handleAce = response => {
    console.log("handleAce");
    if (response === "ACE") {
      setPlayerAce(true);
    }
  };
  const handleValue = (response, hand) => {
    console.log("handleValue");
    if (response === "KING" || response === "QUEEN" || response === "JACK") {
      return 10;
    } else if (response === "ACE") {
      if (`${hand}Total` > 10) {
        return 1;
      } else {
        return 11;
      }
    } else {
      return Number(response);
    }
  };
  const handleWin = () => {
    console.log("handleWin");
    setActive(false);
    setBal(bal + bet);
    setPlayerAce(false);
    setWin(`${bet} WIN`);
  };
  const handlePush = () => {
    console.log("handlePush");
    setActive(false);
    setPlayerAce(false);
    setWin(`PUSH`);
  };
  const handleLose = () => {
    console.log("handleLose");
    setActive(false);
    setBet(0);
    setPlayerAce(false);
    setWin(`${bet} LOSE`);
  };
  const handleHouse = async () => {
    console.log("handleHouse");
    return axios
      .get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
      .then(response => {
        const houseArr = houseHand.slice();
        houseArr.push(response.data.cards[0].image);
        setHouseHand(houseArr);
        setHouseTotal(houseTotal + handleValue(response.data.cards[0].value));
      })
      .catch(err => console.log(`House Hit: ${err}`));
  };
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
      <Button handler={handleHit} content="Hit" size="big" />
      {active ? (
        <Button handler={handleStand} content="Stand" size="big" />
      ) : (
        <Button
          handler={handleDeal}
          content="Deal"
          size="big"
          active="active"
        />
      )}
    </div>
  );
};

export default ButtonList;
