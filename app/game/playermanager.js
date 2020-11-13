const Player = require("./player");
const { MIN_PLAYERS } = require("./const");

class PlayerManager {
  constructor(notify, onEmpty) {
    this.notify = notify;
    this.onEmpty = onEmpty;
    this.players = {};
    this.playerOrder = [];
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
    this.playerOrder.push(name);
    this.notify();
  }

  remove(name) {
    if (this.exists(name)) {
      this.players[name].send('end', {});
      delete this.players[name];
      this.playerOrder.splice(this.playerOrder.indexOf(name), 1);
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
      this.onEmpty();
    } else {
      this.notify();
    }
  }

  allDeactivated() {
    for (var p of Object.values(this.players)) {
      if (p.active) { return false; }
    }
    return true;
  }

  enough() {
    return this.length() >= MIN_PLAYERS;
  }

  _resetConnoisseurs() {
    for (let p of Object.values(this.players)) {
      p.resetRole();
    }
  }

  resetConnoisseurs() {
    this._resetConnoisseurs()
    this.notify();
  }

  setConnoisseur(name) {
    this._resetConnoisseurs();
    this.players[name].setConnoisseur();

    this.notify();
  }

  setNextConnoisseur(previousName) {
    let connoisseur;
    if (previousName === undefined) {
      connoisseur = this.getRandomName();
    } else {
      let nextIndex = (this.playerOrder.indexOf(previousName) + 1) % this.playerOrder.length;
      connoisseur = this.playerOrder[nextIndex];
    }
    this.setConnoisseur(connoisseur);

    return connoisseur;
  }

  getRandomName() {
    const rand = Math.floor(Math.random() * this.length());
    return Object.keys(this.players)[rand];
  }

  getPlayerData() {
    return this.playerOrder.map(name => this.players[name].infoJson())
  }
}

module.exports = PlayerManager;
