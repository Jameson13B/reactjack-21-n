import React, { Component } from "reactn";
import ButtonList from "./Button_List";
import CardList from "./Card_List";
import InfoBoard from "./Info_Board";
import Splash from "./Splash";
import BetToggle from "./Bet_Toggle";
import "../styles/App.css";

class App extends Component {
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
          <BetToggle />
          <ButtonList />
        </div>
        <Splash />
      </div>
    );
  }
}

export default App;

// Dealer ACE Bust

// Refactor ReactN:
// Button_List
