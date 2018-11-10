import React, { Component } from "reactn";
import axios from "axios";
import ButtonList from "./Button_List";
import CardList from "./Card_List";
import InfoBoard from "./Info_Board";
import Splash from "./Splash";
import BetToggle from "./Bet_Toggle";
import "../styles/App.css";

class App extends Component {
  start = () => {
    axios
      .get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then(response => {
        this.setGlobal({
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
    this.global.bal > 0 && this.global.name
      ? (document.getElementById("Splash").style.display = "none")
      : alert("Insert your name and a starting balance higher then $0");
  };
  handleDeal = () => {
    if (this.global.games === 3) {
      axios
        .get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then(response => {
          this.setGlobal({ deckId: response.data.deck_id, games: 1 });
        })
        .catch(err => console.log(`Shuffle: ${err}`));
    }
    axios
      .get(
        `https://deckofcardsapi.com/api/deck/${
          this.global.deckId
        }/draw/?count=4`
      )
      .then(response => {
        const houseHand = [
          response.data.cards[0].image,
          response.data.cards[2].image
        ];
        const houseTotal =
          this.handleValue(response.data.cards[0].value, "house") +
          this.handleValue(response.data.cards[2].value, "house");
        const playerHand = [
          response.data.cards[1].image,
          response.data.cards[3].image
        ];
        const playerTotal =
          this.handleValue(response.data.cards[1].value, "player") +
          this.handleValue(response.data.cards[3].value, "player");
        this.handleAce(response.data.cards[1].value);
        this.handleAce(response.data.cards[3].value);
        this.setGlobal({
          houseTotal,
          playerTotal
        });
        this.setGlobal({
          games: this.global.games + 1,
          active: true,
          houseHand: houseHand,
          playerHand: playerHand,
          houseTotal,
          playerTotal,
          win: 0
        });
        if (
          this.global.houseTotal === 21 &&
          this.global.playerTotal < 22 &&
          this.global.active
        ) {
          console.log("House 21");
          this.handleLose();
        } else if (this.global.playerTotal === 21 && this.global.active) {
          console.log("Player 21");
          this.setGlobal({ bet: this.global.bet + this.global.bet / 2 });
          this.handleWin();
        }
      })
      .catch(err => console.log(`Deal: ${err}`));
  };
  handleHit = () => {
    if (this.global.active) {
      axios
        .get(
          `https://deckofcardsapi.com/api/deck/${
            this.global.deckId
          }/draw/?count=1`
        )
        .then(response => {
          this.handleAce(response.data.cards[0].value);
          const playerHand = this.global.playerHand.slice();
          playerHand.push(response.data.cards[0].image);
          const playerTotal =
            this.global.playerTotal +
            this.handleValue(response.data.cards[0].value);
          this.setGlobal({ playerHand, playerTotal });
          if (playerTotal > 21 && this.global.playerAce) {
            const pT = this.global.playerTotal - 10;
            this.setGlobal({ playerTotal: pT, playerAce: false });
          } else if (playerTotal > 21) {
            this.handleLose();
          }
        })
        .catch(err => console.log(`Hit: ${err}`));
    }
  };
  handleStand = () => {
    if (this.global.houseTotal < 17 && this.global.active) {
      this.handleHouse().then(this.handleStand);
    } else if (this.global.playerTotal === this.global.houseTotal) {
      this.handlePush();
    } else if (
      this.global.playerTotal > this.global.houseTotal ||
      this.global.houseTotal > 21
    ) {
      this.handleWin();
    } else {
      this.handleLose();
    }
  };
  handleIncrease = () => {
    if (!this.global.active) {
      if (this.global.bal >= 5) {
        const bet = this.global.bet + 5;
        const bal = this.global.bal - 5;
        this.setGlobal({ bet, bal });
      }
    }
  };
  handleDecrease = () => {
    if (!this.global.active) {
      if (this.global.bet > 0) {
        const bet = this.global.bet - 5;
        const bal = this.global.bal + 5;
        this.setGlobal({ bet, bal });
      }
    }
  };

  // Support Functions
  handleInputChange = e => {
    this.setGlobal({ [e.target.name]: e.target.value });
  };
  handleAce = response => {
    if (response === "ACE") {
      this.setGlobal({ playerAce: true });
    }
  };
  handleValue = (response, hand) => {
    if (response === "KING" || response === "QUEEN" || response === "JACK") {
      return 10;
    } else if (response === "ACE") {
      if (`this.global.${hand}Total` > 10) {
        return 1;
      } else {
        return 11;
      }
    } else {
      return Number(response);
    }
  };
  handleWin = () => {
    const bal = this.global.bal + this.global.bet;
    this.setGlobal({
      active: false,
      bal,
      playerAce: false,
      win: `${this.global.bet} WIN`
    });
  };
  handlePush = () => {
    this.setGlobal({
      active: false,
      playerAce: false,
      win: `PUSH`
    });
  };
  handleLose = () => {
    this.setGlobal({
      active: false,
      bet: 0,
      playerAce: false,
      win: `${this.global.bet} LOSE`
    });
  };
  handleHouse = async () => {
    return axios
      .get(
        `https://deckofcardsapi.com/api/deck/${
          this.global.deckId
        }/draw/?count=1`
      )
      .then(response => {
        const houseHand = this.global.houseHand.slice();
        houseHand.push(response.data.cards[0].image);
        const houseTotal =
          this.global.houseTotal +
          this.handleValue(response.data.cards[0].value);
        this.setGlobal({ houseHand, houseTotal });
      })
      .catch(err => console.log(`House Hit: ${err}`));
  };

  render() {
    return (
      <div className="App">
        <h1 className="title">ReactJack 21</h1>
        <div className="hands">
          <h1>
            Dealer - {this.global.houseTotal}{" "}
            <i className="fas fa-angle-double-down" />
          </h1>
          <CardList className="dealer" cards={this.global.houseHand} />
          <h1>
            {this.global.name} - {this.global.playerTotal}{" "}
            <i className="fas fa-angle-double-down" />
          </h1>
          <CardList className="player" cards={this.global.playerHand} />
        </div>
        <div className="sidebar">
          <InfoBoard />
          <BetToggle
            increase={this.handleIncrease}
            decrease={this.handleDecrease}
          />
          <ButtonList
            handleDeal={this.handleDeal}
            handleHit={this.handleHit}
            handleStand={this.handleStand}
          />
        </div>
        <Splash handleInputChange={this.handleInputChange} start={this.start} />
      </div>
    );
  }
}

export default App;

// Dealer ACE Bust
