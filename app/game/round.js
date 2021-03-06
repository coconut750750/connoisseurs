const _ = require('lodash');

class Round {
  constructor(n) {
    this.playerCount = n;

    this.connoisseurName = undefined;
    this.reset();
  }

  reset() {
    this.currentBlackCard = undefined;
    this.hiddenWhites = [];
    this.revealedWhites = [];
    this.cardsToPlayer = {};
    this.playerToCards = {};
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

  getPlayed(name) {
    return this.playerToCards[name];
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
    return this.cardsToPlayer[this.winningCid];
  }

  getWinner() {
    const winner = this.cardsToPlayer[this.winningCid];
    return { winner: winner, cards: this.playerToCards[winner] }
  }

  getPlayers() {
    return Object.keys(this.playerToCards);
  }
}

module.exports = Round;