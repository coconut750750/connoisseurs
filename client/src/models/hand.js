export default class Hand {
  constructor(cards, swaps) {
    this.cards = [];
    this.swaps = 0;

    if (cards !== undefined) {
      this.cards = cards;
    }
    if (swaps !== undefined) {
      this.swaps = swaps;
    }
  }
}