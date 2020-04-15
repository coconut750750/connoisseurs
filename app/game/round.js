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
    this.cardsToPlayer = {};
    this.playerToCards = {};
    this.nextConnoisseurName = undefined;
    this.winningCid = undefined;
  }

  setBlackCard(card) {
    this.currentBlackCard = card;
  }

  discard(deck) {
    for (let set of this.revealedWhites) {
      deck.discardWhites(set);
    }
    if (this.currentBlackCard !== undefined) {
      deck.discardBlack(this.currentBlackCard);
    }
  }

  alreadyPlayed(name) {
    return name in this.playerToCards;
  }

  playCards(name, cards) {
    for (let card of cards) {
      this.cardsToPlayer[card.id] = name;
    }
    this.playerToCards[name] = cards;
    this.hiddenWhites.push(cards);
  }

  allPlayed() {
    return Object.keys(this.playerToCards).length === this.playerCount - 1;
  }

  shuffleWhites() {
    this.hiddenWhites = _.shuffle(this.hiddenWhites);
  }

  revealNext() {
    const revealed = this.hiddenWhites.splice(0, 1);
    if (revealed.length === 0) {
      throw new Error("There are no more unrevealed cards");
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
    return cid in this.cardsToPlayer;
  }

  selectWinner(cid) {
    this.winningCid = cid;
    this.nextConnoisseurName = this.cardsToPlayer[this.winningCid];
    return this.nextConnoisseurName;
  }

  getWinner() {
    const winner = this.cardsToPlayer[this.winningCid];
    return { winner: winner, cards: this.playerToCards[winner] }
  }
}

module.exports = Round;