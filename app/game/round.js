const _ = require('lodash');

class Round {
  constructor(n) {
    this.playerCount = n;

    this.reset();
  }

  reset() {
    this.currentBlackCard = undefined;
    this.hiddenWhites = [];
    this.revealedWhites = [];
    this.donePlayers = new Set();
    this.cardOwners = {};
    this.nextConnoisseurName = undefined;
    this.winningCid = undefined;
  }

  setBlackCard(card) {
    this.currentBlackCard = card;
  }

  discard(deck) {
    deck.discardWhites(this.revealedWhites);
    if (this.currentBlackCard !== undefined) {
      deck.discardBlack(this.currentBlackCard);
    }
  }

  alreadyPlayed(name) {
    return this.donePlayers.has(name);
  }

  playCard(name, card) {
    this.donePlayers.add(name);
    this.hiddenWhites.push(card);
    this.cardOwners[card.id] = name;
  }

  allPlayed() {
    return this.donePlayers.size === this.playerCount - 1;
  }

  revealCard(cid) {
    const revealed =  _.remove(this.hiddenWhites, c => c.id === cid);
    if (revealed.length === 0) {
      throw new Error("That card was not played.");
    }
    this.revealedWhites.push(revealed[0]);
  }

  revealAll() {
    this.revealedWhites = this.revealedWhites.concat(this.hiddenWhites);
    this.hiddenWhites = [];
  }

  allRevealed() {
    return this.hiddenWhites.length === 0;
  }

  wasPlayed(cid) {
    return cid in this.cardOwners;
  }

  selectWinner(cid) {
    this.winningCid = cid;
    this.nextConnoisseurName = this.cardOwners[this.winningCid];
    return this.nextConnoisseurName;
  }

  getWinner() {
    return { winner: this.cardOwners[this.winningCid], cid: this.winningCid }
  }
}

module.exports = Round;