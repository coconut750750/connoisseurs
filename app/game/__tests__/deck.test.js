const Deck = require('../deck');

describe('deck test', () => {
  test('loading sets', () => {
    let deck = new Deck(["Base Set"]);

    expect(deck.whiteCards.length).not.toBe(0);
  });

  test('drawing cards', () => {
    let deck = new Deck(["Base Set"]);

    const startingWhite = deck.whiteCardsLeft();
    const startingBlack = deck.blackCardsLeft();

    deck.drawWhiteCard();
    deck.drawBlackCard();

    expect(deck.whiteCardsLeft()).toBe(startingWhite - 1);
    expect(deck.blackCardsLeft()).toBe(startingBlack - 1);
  });

  test('reshuffling', () => {
    let deck = new Deck(["Base Set"]);

    const startingWhite = deck.whiteCardsLeft();
    const startingBlack = deck.blackCardsLeft();

    const white = deck.drawWhiteCard();
    const black = deck.drawBlackCard();

    deck.discardWhite(white);
    deck.discardBlack(black);

    deck.reshuffle();

    expect(deck.whiteCardsLeft()).toBe(startingWhite);
    expect(deck.blackCardsLeft()).toBe(startingBlack);
  });
});
