import React, { Component } from 'react';
import axios from 'axios';
import ButtonList from './Button_List';
import CardList from './Card_List';
import InfoBoard from './Info_Board';
import Splash from './Splash';
import BetToggle from './Bet_Toggle';
import '../styles/App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      bal: '',
      bet: 0,
      win: 0,
      houseTotal: 0,
      playerTotal: 0,
      houseHand:[],
      playerHand:[],
      active: false,
      deckId: 0,
      games: 0,
      playerAce: false
    }
  }

  start = () => {
    axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(response => {this.setState({deckId: response.data.deck_id, houseHand: [], playerHand: [], houseTotal: 0, playerTotal: 0, games: 0, active: false, win: 0})})
      .catch(err => console.log(`Shuffle: ${err}`))
    this.state.bal > 0 && this.state.name ? document.getElementById('Splash').style.display = 'none' : alert('Insert your name and a starting balance higher then $0')
  }
  handleDeal = () => {
    axios.get(`https://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=4`)
      .then(response => {
        const houseHand = [response.data.cards[0].image, response.data.cards[2].image]
        const houseTotal = this.handleValue(response.data.cards[0].value, 'house') + this.handleValue(response.data.cards[2].value, 'house')
        const playerHand = [response.data.cards[1].image, response.data.cards[3].image]
        const playerTotal = this.handleValue(response.data.cards[1].value, 'player') + this.handleValue(response.data.cards[3].value, 'player')
        this.handleAce(response.data.cards[1].value)
        this.handleAce(response.data.cards[3].value)
        if (houseTotal === 21 && playerTotal < 22 && this.state.active) {
          this.handleLose()
        } else if (playerTotal === 21 && this.state.active) {
          this.handleWin()
        } else {this.setState({ games: (this.state.games+1), active: true, houseHand, playerHand, houseTotal, playerTotal, win: 0 })}
      })
      .catch(err => console.log(`Deal: ${err}`))
  }
  handleHit = () => {
    if (this.state.active) {
      axios.get(`https://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=1`)
        .then(response => {
          // Checks if the card is an ACE
          this.handleAce(response.data.cards[0].value)
          // Joins the players hand and new card image
          const playerHand = this.state.playerHand.slice()
          playerHand.push(response.data.cards[0].image) 
          // Update players total
          const playerTotal = this.state.playerTotal + this.handleValue(response.data.cards[0].value)
          // Set State with new values
          this.setState({ playerHand, playerTotal })
          // Check for bust and if the player had an ACE
          if (playerTotal > 21 && this.state.playerAce) {
            const pT = this.state.playerTotal - 10
            this.setState({ playerTotal: pT, playerAce: false })
          } else if (playerTotal > 21) {
            this.handleLose()
          }
        })
        .catch(err => console.log(`Hit: ${err}`))
    }
  }
  handleStand = () => {
    // do {
    //   this.handleHouse()
    //   console.log(this.state.houseTotal)
    // }
    // while (this.state.houseTotal < 17 && this.state.active)
    if (this.state.houseTotal < 17 && this.state.active) {
      this.handleHouse()
      return this.handleStand()
    }
    if (this.state.playerTotal > this.state.houseTotal) {
      this.handleWin()
    } else {
      this.handleLose()
    }
  }
  handleIncrease = () => {
    if (!this.state.active) {
      if (this.state.bal >= 5) {
        const bet = this.state.bet+5
        const bal = this.state.bal-5
        this.setState({ bet, bal })
      }
    }
  }
  handleDecrease = () => {
    if (!this.state.active) {
      if (this.state.bet > 0) {
        const bet = this.state.bet-5
        const bal = this.state.bal+5
        this.setState({ bet, bal })
      }
    }
  }

  // Support Functions
  handleInputChange = e => {this.setState({[e.target.name]: e.target.value})}
  handleValue = (response, hand) => {
    if (response === 'KING' || response === 'QUEEN' || response === 'JACK') {
      return 10
    }
    else if (response === 'ACE') {
      if (`this.state.${hand}Total` > 10) {
        return 1
      } else {return 11}
    } else {
      return Number(response)
    }
  }
  handleWin = () => {
    const bal = this.state.bal + (this.state.bet*2)
    this.setState({
      active: false,
      bet: 0,
      bal,
      playerAce: false,
      win: `${this.state.bet}`
    })
    alert('You Win!')
  }
  handleLose = () => {
    this.setState({
      active: false,
      bet: 0,
      playerAce: false,
      win: 'Lose'
    })
    alert('You Lost')
  }
  handleAce = (response) => {
    if (response === 'ACE') {
      this.setState({playerAce: true})
    }
  }
  handleHouse = () => {
    console.log('Pre handleHouse')
    return (
      axios.get(`https://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=1`)
        .then(response => {
          console.log('I got inside')
          // Joins the house hand and new card image
          const houseHand = this.state.houseHand.slice()
          houseHand.push(response.data.cards[0].image) 
          // Update players total
          const houseTotal = this.state.houseTotal + this.handleValue(response.data.cards[0].value)
          // Set State with new values
          this.setState({ houseHand, houseTotal })
          // Check for bust and if the player had an ACE
          if (houseTotal > 21) {
            this.handleWin()
          }
        })
        .catch(err => console.log(`House Hit: ${err}`))
    )
  }

  render() {
    return (
      <div className='App'>
        <h1 className='title'>ReactJack 21</h1>
        <div className='hands'>
          <h1>Dealer - {this.state.houseTotal} <i className="fas fa-angle-double-down"/></h1>
          <CardList className='dealer' cards={this.state.houseHand} />
          <h1>{this.state.name} - {this.state.playerTotal} <i className="fas fa-angle-double-down"/></h1>
          <CardList className='player' cards={this.state.playerHand} />
        </div>
        <div className='sidebar'>
          <InfoBoard bal={this.state.bal} bet={this.state.bet} win={this.state.win} />
          <BetToggle increase={this.handleIncrease} decrease={this.handleDecrease} active={this.state.active} />
          <ButtonList active={this.state.active} handleDeal={this.handleDeal} handleHit={this.handleHit} handleStand={this.handleStand} />
        </div>

        <Splash name={this.state.name} bal={this.state.bal} handleInputChange={this.handleInputChange} start={this.start} deck={this.state.deckId} />
      </div>
    );
  }
}

export default App;


// Handle Stand
// Tie response
