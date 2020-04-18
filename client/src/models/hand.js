export default class Hand {
  constructor(cards, replaces) {
    this.cards = [];
    this.replaces = 0;

    if (cards !== undefined) {
      this.cards = cards;
    }
    if (replaces !== undefined) {
      this.replaces = replaces;
    }
  }
}