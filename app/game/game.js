const GameInterface = require("../game");
const PlayerManager = require("./playermanager");
const Deck = require("./deck");
const { MIN_PLAYERS, N_CARD_REQUIREMENT } = require("../const");

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

    this.deck = undefined;

    // round specific
    this.currentBlackCard = undefined;
    this.selectedWhites = [];
    this.revealedWhites = [];
    this.donePlayers = new Set();
    this.cardOwners = {};
    this.nextConnoisseurName = undefined;
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

  canStart() {
    return this.phase === PHASES[0];
  }

  enoughPlayers() {
    return this.pmanager.enough();
  }

  start(options) {
    this.started = true;
    this.deck = new Deck(options.sets);

    this.nextConnoisseurName = this.pmanager.setInitialCzar();
    this.roundStart();
  }

  hasStarted() {
    return this.started;
  }

  refillHands() {
    const players = this.pmanager.getAll();
    for (var p of players) {
      p.addCards(deck.drawWhiteCards(p.needCards()));
      p.sendHand();
    }
  }

  revealBlackCard() {
    this.currentBlackCard = this.deck.drawBlackCard();
  }

  roundStart() {
    this.phase = PHASES[1];
    this.notifyPhaseChange();

    this.pmanager.setConnoisseur(this.nextConnoisseurName);
    this.deck.discardWhites(this.revealedWhites);
    this.deck.discardBlack(this.currentBlackCard);

    this.currentBlackCard = undefined;
    this.selectedWhites = [];
    this.revealedWhites = [];
    this.donePlayers.clear();
    this.cardOwners = {};
    this.nextConnoisseurName = undefined;

    this.refillHands();
    this.revealBlackCard();
  }

  playCard(player, cid) {
    if (player.isConnoisseur()) {
      throw new Error("You cannot play white cards.")
    }
    if (this.donePlayers.has(player.name)) {
      throw new Error("You have already played a white card.")
    }

    const removed = player.removeCard(cid);
    if (removed.length === 0) {
      throw new Error("That card is not in your hand.");
    }

    this.donePlayers.add(player.name);
    this.selectedWhites.push(removed[0]);
    this.cardOwners[removed[0].id] = player.name;

    if (this.donePlayers.size === this.pmanager.length()) {
      this.beginReveal();
    }
  }

  replaceCard(player, cid) {

  }

  beginReveal() {
    this.phase = PHASES[2];
    this.notifyPhaseChange();
  }

  revealCard(player, cid) {
    if (!player.isConnoisseur()) {
      throw new Error("You cannot reveal cards.");
    }
    const revealed =  _.remove(this.selectedWhites, c => c.id === cid);
    if (revealed.length === 0) {
      throw new Error("That card was not played.");
    }
    this.revealedWhites.push(revealed[0]);
    // notify revealed card

    if (this.selectedWhite.length === 0) {
      this.beginJudging();
    }
  }

  revealRest(player) {
    if (!player.isConnoisseur()) {
      throw new Error("You cannot reveal cards.");
    }

    this.revealedWhites = this.revealedWhites.concat(this.selectedWhites);
    this.selectedWhites = [];
    // notify revealed card

    this.beginJudging();
  }

  beginJudging() {
    this.phase = PHASES[3];
    this.notifyPhaseChange();
  }

  selectWinner(player, cid) {
    if (!player.isConnoisseur()) {
      throw new Error("You cannot select a winner.");
    }

    if (!(cid in this.cardOwners)) {
      throw new Error("That card was not played.");

    }

    this.nextConnoisseurName = this.cardOwners[cid];
    this.pmanager.get(this.nextConnoisseurName).addPoint();
    // notify winner
    
    this.phase = PHASES[4];
    this.notifyPhaseChange();
  }

  endGame() {
    this.started = false;
    this.phase = PHASES[5];
    this.notifyPhaseChange();

    // notify results
  }

  getPlayerData() {
    return { players: this.pmanager.getAll().map(p => p.json()) };
  }

  notifyPlayerUpdate() {
    this.broadcast('players', this.getPlayerData());
  }

  notifyPhaseChange() {
    this.broadcast('phase', { phase: this.phase });
  }

  notifyRevealed() {
    this.broadcast('revealed', { revealed: this.revealedWhites.map(c => c.json()) });
  }

  delete() {
    this.broadcast('end', {});
    this.onEmpty();
  }
}

module.exports = Game;
