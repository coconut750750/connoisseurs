const GameInterface = require("../game");
const PlayerManager = require("./playermanager");
const Round = require("./round");
const Deck = require("./deck");
const { MIN_PLAYERS, N_CARD_REQUIREMENT } = require("./const");

const PHASES = ['lobby', 'selection', 'reveal', 'judging', 'winner', 'results'];
// options
// sets
// how often to discard
// how many rounds to play (number, or 0 for infinite)

// "see results" option to skip to results

class Game extends GameInterface {
  constructor(code, onEmpty, options, broadcast) {
    super(code, onEmpty, options, broadcast);

    this.reset();
    this.pmanager = new PlayerManager(
      () => this.notifyPlayerUpdate(),
      () => onEmpty(),
    );
  }

  reset() {
    this.started = false;
    this.phase = PHASES[0];
    this.notifyPhaseChange();

    this.deck = undefined;
    this.round = undefined;
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

  start(options) {
    if (this.phase !== PHASES[0]) {
      throw new Error("Cannot start a new game outside of the lobby");
    }
    if (!this.pmanager.enough()) {
      throw new Error("Not enough players have joined the game");
    }
    this.started = true;
    this.deck = new Deck(options.sets);

    this.round = new Round(this.pmanager.length());
    this.round.nextConnoisseurName = this.pmanager.getRandomName();

    this.roundStart();
  }

  hasStarted() {
    return this.started;
  }

  refillHands() {
    const players = this.pmanager.getAll();
    for (var p of players) {
      p.addCards(this.deck.drawWhiteCards(p.needCards()));
      p.sendHand();
    }
  }

  revealBlackCard() {
    this.round.setBlackCard(this.deck.drawBlackCard());
    this.notifyBlackCard();
  }

  roundStart() {
    if (this.phase !== PHASES[0] && this.phase !== PHASES[4]) {
      throw new Error("You cannot start a new round right now");
    }
    this.phase = PHASES[1];
    this.notifyPhaseChange();

    this.pmanager.setConnoisseur(this.round.nextConnoisseurName);

    this.round.discard(this.deck);
    this.notifyDeckInfo();

    this.round.reset();

    this.refillHands();
    this.revealBlackCard();
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
    if (this.round.currentBlackCard.blanks !== cids.length) {
      throw new Error("You didn't play the right amount of white cards");
    }

    const removed = player.removeCards(cids);
    if (removed.length !== cids.length) {
      throw new Error("A card not in your hand was played");
    }

    player.sendHand();
    this.round.playCards(player.name, removed);
    this.notifyPlayed(player);

    if (this.round.allPlayed()) {
      this.beginReveal();
    }
  }

  replaceCard(player, cid) {

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
    this.phase = PHASES[5];
    this.notifyPhaseChange();

    this.notifyResults();
  }

  generateResults() {
    return {
      points: this.pmanager.getAll().map(p => p.pointsJson()),
    };
  }

  getPlayerData() {
    return { players: this.pmanager.getAll().map(p => p.infoJson()) };
  }

  notifyPlayerUpdate() {
    this.broadcast('players', this.getPlayerData());
  }

  notifyPhaseChange() {
    this.broadcast('phase', { phase: this.phase });
  }

  notifyPlayed(player) {
    if (this.phase === PHASES[1] && this.round.alreadyPlayed(player.name)) {
      player.send('played', { cards: this.round.getPlayed(player.name) });
    }
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
