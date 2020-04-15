var _ = require('lodash');

export default class Player {
  constructor(name, isAdmin, active, role) {
    this.name = name;
    this.isAdmin = isAdmin;
    this.active = active;
    this.role = role;
  }

  isConnoisseur() {
    return this.role === "connoisseur";
  }
}

export function getMeIndex(players, name) {
  return _.findIndex(players, { name });
}

export function getMePlayer(players, name) {
  return players[getMeIndex(players, name)];
}

export function newPlayer(playerJson) {
  return new Player(playerJson.name, playerJson.isAdmin, playerJson.active, playerJson.role);
}