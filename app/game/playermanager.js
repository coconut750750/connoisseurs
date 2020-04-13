const Player = require("./player");
const { MIN_PLAYERS } = require("../const");

class PlayerManager {
  constructor(notify, onEmpty) {
    this.notify = notify;
    this.onEmpty = onEmpty;
    this.players = {};
  }

  length() {
    return Object.keys(this.players).length;
  }

  exists(name) {
    return name in this.players;
  }

  get(name) {
    return this.players[name];
  }

  getAll() {
    return Object.values(this.players);
  }

  add(name, socket) {
    this.players[name] = new Player(name, socket, Object.keys(this.players).length === 0);
    this.notify();
  }

  remove(name) {
    if (this.exists(name)) {
      this.players[name].send('end', {});
      delete this.players[name];
    }
    if (this.allDeactivated()) {
      this.onEmpty();
    } else {
      this.notify();
    }
  }

  isActive(name) {
    return this.players[name].active;
  }

  activate(name, socket) {
    if (this.exists(name)) {
      this.players[name].activate(socket);
      this.notify();
    }
  }

  deactivate(name) {
    if (this.exists(name)) {
      this.players[name].deactivate();
    }
    if (this.allDeactivated()) {
      this.endGame();
    } else {
      this.notify();
    }
  }

  enough() {
    return this.length() >= MIN_PLAYERS;
  }

  resetCzars() {
    for (let p of Object.values(this.players)) {
      p.resetRole();
    }
  }

  setInitialCzar() {
    this.resetCzars();
    const rand = Math.floor(Math.random() * this.length());
    const randName = Object.keys(this.players)[rand];
    this.players[randName].setCzar();

    this.notify();
  }

  setCzar(name) {
    resetCzars();
    this.players[name].setCzar();

    this.notify();
  }
}

module.exports = PlayerManager;
