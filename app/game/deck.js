const _ = require('lodash');
const fs = require('fs');
const path = require("path");

const BlackCard = require('./blackcard');
const WhiteCard = require('./whitecard');

function jsonFromFile(file) {
  const filepath = path.join(__dirname, `./sets/${file}`);
  const contents = fs.readFileSync(filepath, 'utf8');
  const json = JSON.parse(contents.trim());
  return json;
}

class Deck {
  constructor(sets) {
    this.whiteCards = [];
    this.blackCards = [];

    this.whiteDeck = [];
    this.blackDeck = [];

    this.whiteDiscard = [];
    this.blackDiscard = [];
    this.load(sets);
  }

  load(sets) {
    for (let set of sets) {
      const { blackCards, whiteCards } = jsonFromFile(set);
      for (let blackcard of blackCards) {
        this.blackCards.push(new BlackCard(this.blackCards.length, blackcard.text, blackcard.pick));
      }
      for (let whitecard of whiteCards) {
        this.whiteCards.push(new WhiteCard(this.whiteCards.length, whitecard));
      }
    }

    this.whiteDeck = _.shuffle(this.whiteCards);
    this.blackDeck = _.shuffle(this.blackCards);
  }

  getWhite(i) {
    return this.whiteCards[i];
  }

  getBlack(i) {
    return this.blackCards[i];
  }

  drawWhiteCard() {
    return this.whiteDeck.pop();
  }

  drawWhiteCards(n) {
    let cards = [];
    for (let i = 0; i < n; i++) {
      cards.push(this.drawWhiteCard());
    }
    return cards;
  }

  drawBlackCard() {
    return this.blackDeck.pop();
  }

  whiteCardsLeft() {
    return this.whiteDeck.length;
  }

  blackCardsLeft() {
    return this.blackDeck.length;
  }

  discardWhite(card) {
    this.whiteDiscard.push(card);
  }

  discardWhites(cards) {
    for (let c of cards) {
      this.discardWhite(c);
    }
  }

  discardBlack(card) {
    this.blackDiscard.push(card);
  }

  whiteDiscardCount() {
    return this.whiteDiscard.length;
  }

  blackDiscardCount() {
    return this.blackDiscard.length;
  }

  reshuffle() {
    this.whiteDeck = _.shuffle(_.concat(this.whiteDeck, this.whiteDiscard));
    this.blackDeck = _.shuffle(_.concat(this.blackDeck, this.blackDiscard));

    this.whiteDiscard = [];
    this.blackDiscard = [];
  }

  json() {
    return {
      whitesLeft: this.whiteCardsLeft(),
      blacksLeft: this.blackCardsLeft(),
      whiteDiscard: this.whiteDiscardCount(),
      blackDiscard: this.blackDiscardCount()
    };
  }
}

module.exports = Deck;
