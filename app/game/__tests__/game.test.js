const Game = require("../game");
const { CONNOISSEUR_ROLE } = require("../const");

const threePlayerStart = (game) => {
  game.addPlayer("p1", undefined);
  game.addPlayer("p2", undefined);
  game.addPlayer("p3", undefined);

  game.start({ sets: ['Base Set']});
};

const setConnoisseur = (game, name) => {
  game.pmanager.setConnoisseur(name);
};

const setNumBlank = (game, n) => {
  game.round.currentBlackCard.blanks = n;
}

const playCards = (game, names) => {
  setNumBlank(game, 1);
  let cids = [];
  for (let name of names) {
    const p = game.getPlayer(name);
    const c = p.hand[0];
    game.playCards(p, [c.id]);
    cids.push([c.id]);
  }
  return cids;
};

const playDoubleCards = (game, names) => {
  setNumBlank(game, 2);
  let cids = [];
  for (let name of names) {
    const p = game.getPlayer(name);
    const c1 = p.hand[0];
    const c2 = p.hand[1];
    game.playCards(p, [c1.id, c2.id]);
    cids.push([c1.id, c2.id]);
  }
  return cids;
};

const revealCards = (game, player) => {
  game.revealRest(player);
};

describe('game start', () => {
  test('one player fails to start', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    game.addPlayer("p1", undefined);

    expect(() => game.start(undefined)).toThrow();
  });

  test('one player that is duplicated fails to start', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    game.addPlayer("p1", undefined);
    game.addPlayer("p1", undefined);

    expect(() => game.start(undefined)).toThrow();
  });

  test('three players should start', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);

    expect(game.started).toBeTruthy();
    expect(game.phase).toEqual("selection");
    expect(game.deck).not.toEqual(undefined);
    expect(game.round).not.toEqual(undefined);
  });

  test('start game should be broadcasted', () => {
    let didBroadcast = false;
    const game = new Game('code', () => {}, undefined, (event, data) => {
      didBroadcast = didBroadcast || (event === 'phase' && data.phase === 'selection');
    });
    threePlayerStart(game);

    expect(didBroadcast).toBeTruthy();
  });

  test('player gets cards and hands are broadcasted', () => {
    let sentHand = false;
    const game = new Game('code', () => {}, undefined, () => {});
    game.addPlayer("p1", {
      emit: (event, data) => {
        sentHand = true;
      }
    });

    threePlayerStart(game);

    expect(sentHand).toBeTruthy()
  });

  test('black card is chosen and is broadcasted', () => {
    let didBroadcast = false;
    const game = new Game('code', () => {}, undefined, (event, data) => {
      didBroadcast = didBroadcast || (event === 'black' && 'card' in data);
    });
    threePlayerStart(game);

    expect(didBroadcast).toBeTruthy();
  });

  test('connoisseur is selected and broadcasted', () => {
    let didBroadcast = false;
    const game = new Game('code', () => {}, undefined, (event, data) => {
      if (event !== 'players') {
        return;
      }

      const { players } = data;
      for (let p of players) {
        if (p.role === CONNOISSEUR_ROLE) {
          didBroadcast = true;
        }
      }
    });
    threePlayerStart(game);

    expect(didBroadcast).toBeTruthy();
  });
});

describe('playing white cards', () => {
  test('must be in selection phase', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    game.addPlayer('p1', undefined);
    const p1 = game.getPlayer('p1');
    expect( () => game.playCards(p1, [0])).toThrow();
  });

  test('playing one reduces hand size by one', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p3');
    const p1 = game.getPlayer('p1');
    const card = p1.hand[0];

    expect(p1.needCards()).toBe(0);

    setNumBlank(game, 1);
    game.playCards(p1, [card.id]);

    expect(p1.needCards()).toBe(1);
  });

  test('playing two reduces hand size by two', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p3');
    const p1 = game.getPlayer('p1');
    const card1 = p1.hand[0];
    const card2 = p1.hand[1];

    expect(p1.needCards()).toBe(0);

    setNumBlank(game, 2); 
    game.playCards(p1, [card1.id, card2.id]);

    expect(p1.needCards()).toBe(2);
  });

  test('cannot play twice', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p3');
    const p1 = game.getPlayer('p1');
    const card1 = p1.hand[0];
    const card2 = p1.hand[1];

    setNumBlank(game, 1);
    game.playCards(p1, [card1.id]);

    expect( () => game.playCards(p1, [card2.id]) ).toThrow();
  });

  test('cannot play a card that is not in hand', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p3');
    const p1 = game.getPlayer('p1');
    const p2 = game.getPlayer('p2');
    const invalidCard = p2.hand[0];

    setNumBlank(game, 1);
    expect( () => game.playCards(p1, [invalidCard.id]) ).toThrow();
  });

  test('cannot play one card in hand and one card not in hand', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p3');
    const p1 = game.getPlayer('p1');
    const p2 = game.getPlayer('p2');
    const validCard = p1.hand[0];
    const invalidCard = p2.hand[0];

    setNumBlank(game, 2);
    expect( () => game.playDoubleCards(p1, [validCard.id, invalidCard.id]) ).toThrow();
  });

  test('fail when not enough cards played', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p3');
    const p1 = game.getPlayer('p1');
    const p2 = game.getPlayer('p2');
    const card = p1.hand[0];

    setNumBlank(game, 2);
    expect( () => game.playDoubleCards(p1, [card.id]) ).toThrow();
  });

  test('fail when too many cards played', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p3');
    const p1 = game.getPlayer('p1');
    const p2 = game.getPlayer('p2');
    const card1 = p1.hand[0];
    const card2 = p1.hand[1];

    setNumBlank(game, 1);
    expect( () => game.playDoubleCards(p1, [card1.id, card2.id]) ).toThrow();

  });

  test('connoisseur cannot play a card', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const p1 = game.getPlayer('p1');
    const card = p1.hand[0];

    setNumBlank(game, 1);
    expect( () => game.playCards(p1, [card.id]) ).toThrow();
  });

  test('goes to reveal phase after every player plays and is broadcasted', () => {
    let didBroadcast = false;
    const game = new Game('code', () => {}, undefined, (event, data) => {
      didBroadcast = didBroadcast || (event === 'phase' && data.phase === 'reveal');
    });
    threePlayerStart(game);
    setConnoisseur(game, 'p3');
    const p1 = game.getPlayer('p1');
    const p2 = game.getPlayer('p2');
    const card1 = p1.hand[0];
    const card2 = p2.hand[0];

    setNumBlank(game, 1);
    game.playCards(p1, [card1.id]);
    game.playCards(p2, [card2.id]);

    expect(didBroadcast).toBeTruthy();
  });
});

describe('revealing white cards', () => {
  test('must be reveal phase', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const p1 = game.getPlayer('p1');
    expect( () => game.revealNext(p1) ).toThrow();
  });

  test('only connoisseur can reveal', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const cids = playCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1')
    const p2 = game.getPlayer('p2')

    expect( () => game.revealNext(p2) ).toThrow();
    expect( () => game.revealNext(p1) ).not.toThrow();
  });

  test('cannot reveal next when no more to reveal card twice', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const cids = playCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1')

    expect( () => game.revealNext(p1) ).not.toThrow();
    expect( () => game.revealNext(p1) ).not.toThrow();
    expect( () => game.revealNext(p1) ).toThrow();
  });

  test('revealing one card broadcasts the card', () => {
    let didBroadcast = false;
    const game = new Game('code', () => {}, undefined, (event, data) => {
      if (event !== 'revealed') {
        return;
      }

      const { revealed } = data;
      didBroadcast = didBroadcast || revealed.length === 1;
    });
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const cids = playCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1')

    game.revealNext(p1);

    expect(didBroadcast).toBeTruthy();
  });

  test('revealing all cards works and is broadcasted', () => {
    let didBroadcast = false;
    const game = new Game('code', () => {}, undefined, (event, data) => {
      if (event !== 'revealed') {
        return;
      }

      const { revealed } = data;
      didBroadcast = didBroadcast || revealed.length === 2;
    });
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    playCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1')

    game.revealRest(p1);

    expect(didBroadcast).toBeTruthy();
  });

  test('revealing all cards immediately goes to judging phase', () => {
    let didBroadcast = false;
    const game = new Game('code', () => {}, undefined, (event, data) => {
      didBroadcast = didBroadcast || (event === 'phase' && data.phase === 'judging');
    });
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    playCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1')

    game.revealRest(p1);

    expect(didBroadcast).toBeTruthy();
  });

  test('individually revealing all cards goes to judging phase', () => {
    let didBroadcast = false;
    const game = new Game('code', () => {}, undefined, (event, data) => {
      didBroadcast = didBroadcast || (event === 'phase' && data.phase === 'judging');
    });
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const cids = playCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1');

    game.revealNext(p1);
    game.revealNext(p1);

    expect(didBroadcast).toBeTruthy();
  });
});

describe('selecting a winner', () => {
  test('must be in judge phase', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const p1 = game.getPlayer('p1');
    expect( () => game.selectWinner(p1, 0) ).toThrow();
  });

  test('only connoisseur can select a winner', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const cids = playCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1');
    const p2 = game.getPlayer('p2');
    revealCards(game, p1);

    expect( () => game.selectWinner(p2, cids[0][0]) ).toThrow();
    expect( () => game.selectWinner(p1, cids[0][0]) ).not.toThrow();
  });

  test('selecting winner when two cards played', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const cids = playDoubleCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1');
    const p2 = game.getPlayer('p2');
    revealCards(game, p1);

    expect( () => game.selectWinner(p1, cids[0][1]) ).not.toThrow();
  });

  test('winner is broadcasted', () => {
    let didBroadcast = false;
    const game = new Game('code', () => {}, undefined, (event, data) => {
      if (event !== 'win') {
        return;
      }

      const { winner, cards } = data;
      didBroadcast = didBroadcast || (winner !== undefined && cards !== undefined);
    });
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const cids = playCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1');
    const p2 = game.getPlayer('p2');
    revealCards(game, p1);

    game.selectWinner(p1, cids[0][0]);

    expect(didBroadcast).toBeTruthy();

    expect(p2.points).toBe(1);
  });

  test('immediately goes to winner phase', () => {
    let didBroadcast = false;
    const game = new Game('code', () => {}, undefined, (event, data) => {
      didBroadcast = didBroadcast || (event === 'phase' && data.phase === 'winner');
    });
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const cids = playCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1');
    revealCards(game, p1);

    game.selectWinner(p1, cids[0][0]);

    expect(game.phase).toEqual('winner');
    expect(didBroadcast).toBeTruthy();
  });

  test('cannot select a second winner', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const cids = playCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1');
    revealCards(game, p1);

    game.selectWinner(p1, cids[0][0]);
    expect( () => game.selectWinner(p1, cids[0][0])).toThrow();
  });
});

describe('starting a new round', () => {
  test('used cards are discarded', () => {
    const game = new Game('code', () => {}, undefined, () => {});
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const cids = playCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1');
    revealCards(game, p1);
    game.selectWinner(p1, cids[0]);

    expect( () => game.roundStart() ).not.toThrow();

    expect(game.deck.whiteDiscardCount()).toBe(2);
    expect(game.deck.blackDiscardCount()).toBe(1);
  });

  test('last winner is new connoisseur', () => {
    let newConnoisseur = "";
    const game = new Game('code', () => {}, undefined, (event, data) => {
      if (event !== 'players') {
        return;
      }

      const { players } = data;
      for (let p of players) {
        if (p.role === CONNOISSEUR_ROLE) {
          newConnoisseur = p.name;
        }
      }
    });

    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const cids = playCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1');
    revealCards(game, p1);
    game.selectWinner(p1, cids[0][0]);

    game.roundStart();

    expect(newConnoisseur).toBe('p2');
  });

  test('deck info is broadcasted', () => {
    let broadcasts = 0;
    const game = new Game('code', () => {}, undefined, (event, data) => {
      if (event !== 'deck') {
        return;
      }

      broadcasts += 1;
    });

    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const cids = playCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1');
    revealCards(game, p1);
    game.selectWinner(p1, cids[0][0]);
    game.roundStart();

    expect(broadcasts).toBe(2);
  });
});

describe('game end', () => {
  test('can only game end only a round is complete', () => {
    const game = new Game('code', () => {}, undefined, (event, data) => {});
    expect(() => game.endGame()).toThrow();
    
    threePlayerStart(game);
    expect(() => game.endGame()).toThrow();

    setConnoisseur(game, 'p1');
    expect(() => game.endGame()).toThrow();

    const cids = playCards(game, ['p2', 'p3']);
    expect(() => game.endGame()).toThrow();

    const p1 = game.getPlayer('p1');
    revealCards(game, p1);
    expect(() => game.endGame()).toThrow();

    game.selectWinner(p1, cids[0][0]);
    expect(() => game.endGame()).not.toThrow();
  });

  test('phase change is broadcasted', () => {
    let didBroadcast = false;
    const game = new Game('code', () => {}, undefined, (event, data) => {
      didBroadcast = didBroadcast || (event === 'phase' && data.phase === 'results');
    });
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const cids = playCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1');
    revealCards(game, p1);
    game.selectWinner(p1, cids[0][0]);
    game.endGame();

    expect(didBroadcast).toBeTruthy();
  });

  test('results are broadcasted', () => {
    let didBroadcast = false;
    const game = new Game('code', () => {}, undefined, (event, data) => {
      didBroadcast = didBroadcast || (event === 'results');
    });
    threePlayerStart(game);
    setConnoisseur(game, 'p1');
    const cids = playCards(game, ['p2', 'p3']);
    const p1 = game.getPlayer('p1');
    revealCards(game, p1);
    game.selectWinner(p1, cids[0][0]);
    game.endGame();

    expect(didBroadcast).toBeTruthy();
  });
});