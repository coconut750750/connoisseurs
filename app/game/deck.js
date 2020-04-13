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

    this.whiteDiscard = [];
    this.blackDiscard = [];
    this.load(sets);
  }

  load(sets) {
    for (let set of sets) {
      const { blackCards, whiteCards } = jsonFromFile(set);
      for (let [i, blackcard] of blackCards.entries()) {
        this.blackCards.push(new BlackCard(i, blackcard.text, blackcard.pick));
      }
      for (let [i, whitecard] of whiteCards.entries()) {
        this.whiteCards.push(new WhiteCard(i, whitecard));
      }
    }

    this.whiteCards = _.shuffle(this.whiteCards);
    this.blackCards = _.shuffle(this.blackCards);
  }

  drawWhiteCard() {
    return this.whiteCards.pop();
  }

  drawBlackCard() {
    return this.blackCards.pop();
  }

  whiteCardsLeft() {
    return this.whiteCards.length;
  }

  blackCardsLeft() {
    return this.blackCards.length;
  }

  discardWhite(card) {
    this.whiteDiscard.push(card);
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
    this.whiteCards = _.shuffle(_.concat(this.whiteCards, this.whiteDiscard));
    this.blackCards = _.shuffle(_.concat(this.blackCards, this.blackDiscard));

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
