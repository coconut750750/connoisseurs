const GameInterface = require("../game");
const PlayerManager = require("./playermanager");
const { MIN_PLAYERS } = require("../const");

const PHASES = ['lobby', 'board', 'results'];
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
    this.phase = PHASES[1];
    this.notifyPhaseChange();

    this.pmanager.setInitialCzar();
  }

  hasStarted() {
    return this.started;
  }

  endGame() {
    this.started = false;
    this.phase = PHASES[2];
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

  delete() {
    this.broadcast('end', {});
    this.onEmpty();
  }
}

module.exports = Game;
