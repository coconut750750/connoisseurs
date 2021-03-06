const GameInterface = require("../game");
const PlayerManager = require("./playermanager");
const Round = require("./round");
const Deck = require("./deck");
const { MIN_PLAYERS, N_CARD_REQUIREMENT } = require("./const");

const PHASES = ['lobby', 'selection', 'reveal', 'judging', 'winner', 'results'];
// options
// how often to replace
// how many rounds to play (number, or 0 for infinite)

class Game extends GameInterface {
  constructor(code, onEmpty, options, broadcast) {
    super(code, onEmpty, options, broadcast);

    this.reset();
    this.pmanager = new PlayerManager(
      () => this.notifyPlayerUpdate(),
      () => this.delete(),
    );
  }

  reset() {
    this.started = false;
    this.phase = PHASES[0];
    this.notifyPhaseChange();

    this.deck = undefined;
    this.round = undefined;
    this.roundsPerSwap = 0;
    this.roundCount = 0;
  }

  playerExists(name) {
    return this.pmanager.exists(name);
  }

  getPlayer(name) {
    return this.pmanager.get(name);
  }

  addPlayer(name, socket) {
    this.pmanager.add(name, socket);
  }

  removePlayer(name) {
    this.pmanager.remove(name);
  }

  isActive(name) {
    return this.pmanager.isActive(name);
  }

  activatePlayer(name, socket) {
    this.pmanager.activate(name, socket);
  }

  deactivatePlayer(name) {
    this.pmanager.deactivate(name);
  }

  start(sets, roundsPerSwap) {
    if (this.phase !== PHASES[0]) {
      throw new Error("Cannot start a new game outside of the lobby");
    }
    if (!this.pmanager.enough()) {
      throw new Error("Not enough players have joined the game");
    }
    if (sets.length === 0) {
      throw new Error("You must specify at least one set to use");
    }
    this.deck = new Deck(sets);
    if (this.deck.whiteDeck.length === 0) {
      throw new Error("There are no white cards in the selected sets")
    }
    if (this.deck.blackDeck.length === 0) {
      throw new Error("There are no black cards in the selected sets")
    }

    this.started = true;
    this.roundsPerSwap = roundsPerSwap;
    this.roundCount = 0;

    this.round = new Round(this.pmanager.length());

    this.resetPlayers();

    this.roundStart();
  }

  resetPlayers() {
    for (let p of this.pmanager.getAll()) {
      p.emptyHand();
      p.resetPoints();
      p.resetSwaps();
    }
  }

  hasStarted() {
    return this.started;
  }

  shuffleDeck() {
    if (!this.started) {
      throw new Error("You cannot shuffle the deck outside of the game");
    }
    this.deck.reshuffle();
    this.notifyDeckInfo();
  }

  upkeep() {
    if (this.roundsPerSwap > 0) {
      this.roundCount = (this.roundCount + 1) % this.roundsPerSwap;
    }

    const players = this.pmanager.getAll();
    for (var p of players) {
      p.addCards(this.deck.drawWhiteCards(p.needCards()));
      if (this.roundsPerSwap > 0 && this.roundCount === 0) {
        p.addSwaps(1);
      }
      p.sendHand();
    }
  }

  revealBlackCard() {
    const blackCard = this.deck.drawBlackCard();
    if (blackCard === undefined) {
      this.phase = PHASES[4];
      this.endGame();
    } else {
      this.round.setBlackCard(blackCard);
      this.notifyBlackCard();
    }
  }

  roundStart() {
    if (this.phase !== PHASES[0] && this.phase !== PHASES[4]) {
      throw new Error("You cannot start a new round right now");
    }
    this.phase = PHASES[1];
    this.notifyPhaseChange();

    this.round.connoisseurName = this.pmanager.setNextConnoisseur(this.round.connoisseurName);

    this.round.discard(this.deck);
    this.round.reset();

    this.upkeep();
    this.revealBlackCard();

    this.notifyDeckInfo();
    this.notifyReadyPlayers();
  }

  playCards(player, cids) {
    if (this.phase !== PHASES[1]) {
      throw new Error("You cannot play white cards right now");
    }
    if (player.isConnoisseur()) {
      throw new Error("You cannot play white cards");
    }
    if (this.round.alreadyPlayed(player.name)) {
      throw new Error("You have already played a white card");
    }

    const count = cids.length;
    const required = this.round.currentBlackCard.blanks;
    if (required !== count) {
      throw new Error(`You must play exactly ${required} white card(s)`);
    }

    const removed = player.removeCards(cids);
    if (removed.length !== count) {
      player.addCards(removed);
      throw new Error("A card not in your hand was played");
    }

    player.sendHand();
    this.round.playCards(player.name, removed);
    this.notifyPlayed(player);

    this.notifyReadyPlayers();

    if (this.round.allPlayed()) {
      this.beginReveal();
    }
  }

  swapCards(player, cids) {
    if (this.phase !== PHASES[1]) {
      throw new Error("You cannot replace cards right now");
    }

    const count = cids.length;
    if (!player.canSwap(count)) {
      throw new Error("You can't swap that many cards");
    }

    const removed = player.removeCards(cids);
    if (removed.length !== count) {
      player.addCards(removed);
      throw new Error("A card not in your hand was replaced");
    }

    player.useSwaps(count);
    player.addCards(this.deck.drawWhiteCards(count));
    player.sendHand();
    this.notifyDeckInfo();
  }

  beginReveal() {
    this.phase = PHASES[2];
    this.notifyPhaseChange();
    this.round.shuffleWhites();
  }

  revealNext(player) {
    if (this.phase !== PHASES[2]) {
      throw new Error("You cannot reveal cards right now");
    }
    if (!player.isConnoisseur()) {
      throw new Error("You cannot reveal cards");
    }
    
    this.round.revealNext();
    this.notifyRevealed();

    if (this.round.allRevealed()) {
      this.beginJudging();
    }
  }

  revealRest(player) {
    if (this.phase !== PHASES[2]) {
      throw new Error("You cannot reveal cards right now");
    }
    if (!player.isConnoisseur()) {
      throw new Error("You cannot reveal cards");
    }

    this.round.revealAll();
    this.notifyRevealed();

    this.beginJudging();
  }

  beginJudging() {
    this.phase = PHASES[3];
    this.notifyPhaseChange();
  }

  selectWinner(player, cid) {
    if (this.phase !== PHASES[3]) {
      throw new Error("You cannot select a winner right now");
    }
    if (!player.isConnoisseur()) {
      throw new Error("You cannot select a winner");
    }
    if (!this.round.wasPlayed(cid)) {
      throw new Error("That card was not played");

    }

    const winner = this.round.selectWinner(cid);
    this.pmanager.get(winner).addPoint();
    this.notifyWin();
    this.notifyPoints();
    
    this.phase = PHASES[4];
    this.notifyPhaseChange();
  }

  endGame() {
    if (this.phase !== PHASES[4]) {
      throw new Error("You cannot end the game right now");
    }
    this.started = false;
    this.notifyResults();
    this.pmanager.resetConnoisseurs();

    this.phase = PHASES[5];
    this.notifyPhaseChange();
  }

  generateResults() {
    return {
      points: this.pmanager.getAll().map(p => p.pointsJson()),
    };
  }

  notifyPlayerUpdate() {
    this.broadcast('players', { players: this.pmanager.getPlayerData() });
  }

  notifyPhaseChange() {
    this.broadcast('phase', { phase: this.phase });
  }

  notifyPlayed(player) {
    if (this.phase === PHASES[1] && this.round.alreadyPlayed(player.name)) {
      player.send('played', { cards: this.round.getPlayed(player.name) });
    }
  }

  notifyReadyPlayers() {
    this.broadcast('ready', { 'names': this.round.getPlayers() });
  }

  notifyBlackCard() {
    this.broadcast('black', { card: this.round.currentBlackCard.json() });
  }

  notifyDeckInfo() {
    this.broadcast('deck', { deck: this.deck.json() });
  }

  notifyRevealed() {
    this.broadcast('revealed', { revealed: this.round.revealedWhites });
  }

  notifyWin() {
    const { winner, cards } = this.round.getWinner();
    if (cards === undefined) {
      return;
    }
    this.broadcast('win', { winner, cards });
  }

  notifyPoints() {
    this.broadcast('points', { points: this.pmanager.getAll().map(p => p.pointsJson()) });
  }

  notifyResults() {
    this.broadcast('results', this.generateResults());
  }

  reconnectSendBlack(player) {
    if (this.started) {
      player.send('black', { card: this.round.currentBlackCard.json() });
    }
  }

  reconnectSendReady(player) {
    if (this.started) {
      player.send('ready', { 'names': this.round.getPlayers() });
    }
  }

  reconnectSendRevealed(player) {
    if (this.phase === PHASES[3]) {
      player.send('revealed', { revealed: this.round.revealedWhites });
    }
  }

  reconnectSendWinner(player) {
    if (this.phase === PHASES[4]) {
      const { winner, cards } = this.round.getWinner();
      if (cards === undefined) {
        return;
      }
      this.broadcast('win', { winner, cards });
    }
  }

  reconnectSendPoints(player) {
    if (this.started) {
      player.send('points', { points: this.pmanager.getAll().map(p => p.pointsJson()) });
    }
  }

  reconnectSendDeckInfo(player) {
    if (this.started) {
      player.send('deck', { deck: this.deck.json() });
    }
  }

  reconnectSendResults(player) {
    player.send('results', this.generateResults());
  }

  delete() {
    this.broadcast('end', {});
    this.onEmpty();
  }
}

module.exports = Game;
