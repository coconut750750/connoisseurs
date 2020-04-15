const Player = require('../player');
const WhiteCard = require('../whitecard');

describe('player test', () => {
  test('player setting roles', () => {
    const player = new Player("player", undefined, false);
    player.setConnoisseur();
    expect(player.isConnoisseur()).toBeTruthy();
    
    player.resetRole();
    expect(player.isConnoisseur()).toBeFalsy();
  });

  test('player adding cards', () => {
    const player = new Player("player", undefined, false);
    const cardStr = "white card!";
    const card = new WhiteCard(1, cardStr);

    expect(player.hand.length).toBe(0);
    player.addCard(card);
    expect(player.hand.length).toBe(1);
    expect(player.hand[0].text).toEqual(cardStr);
  });

  test('player removing cards', () => {
    const player = new Player("player", undefined, false);

    player.addCard(new WhiteCard(1, "1"));
    player.addCard(new WhiteCard(2, "2"));

    player.removeCards([2]);
    expect(player.hand.length).toBe(1);
    expect(player.hand[0].id).toBe(1);
  });
});
