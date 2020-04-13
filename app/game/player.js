var _ = require("lodash");
const { PLAYER_ROLE, CZAR_ROLE, N_CARD_REQUIREMENT } = require("./const");

class Player {
  constructor(name, socket, isAdmin) {
    this.name = name;
    this.socket = socket;
    this.isAdmin = isAdmin;
    this.active = true;

    this.role = PLAYER_ROLE;
    this.points = 0;

    this.hand = [];
  }

  setCzar() {
    this.role = CZAR_ROLE;
  }

  resetRole() {
    this.role = PLAYER_ROLE;
  }

  isCzar() {
    return this.role === CZAR_ROLE;
  }

  addPoint() {
    this.points += 1;
  }

  resetPoints() {
    this.points = 0;
  }

  addCard(card) {
    this.hand.push(card);
  }

  addCards(cards) {
    this.hand = _.concat(this.hand, cards);
  }

  resetHand() {
    this.hand = [];
  }

  removeCard(cid) {
    _.remove(this.hand, c => c.id === cid)
  }

  enoughCards() {
    return this.hand.length === N_CARD_REQUIREMENT;
  }

  activate(socket) {
    this.active = true;
    this.socket = socket;
  }

  deactivate() {
    this.active = false;
    this.socket = undefined;
  }

  json() {
    return {
      name: this.name,
      isAdmin: this.isAdmin,
      active: this.active,
      role: this.role,
      points: this.points,
    };
  }

  send(event, data) {
    if (this.socket !== undefined) {
      this.socket.emit(event, data);
    }
  }

  sendHand() {
    send('hand', { 'hand' : this.hand.map(c => c.json()) });
  }
}

module.exports = Player;
