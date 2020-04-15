const Player = require("./player");
const { MIN_PLAYERS } = require("./const");

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
    if (this.exists(name)) {
      return;
    }
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

  resetConnoisseurs() {
    for (let p of Object.values(this.players)) {
      p.resetRole();
    }
  }

  setConnoisseur(name) {
    this.resetConnoisseurs();
    this.players[name].setConnoisseur();

    this.notify();
  }

  getRandomName() {
    const rand = Math.floor(Math.random() * this.length());
    return Object.keys(this.players)[rand];
  }
}

module.exports = PlayerManager;
