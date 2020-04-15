var _ = require("lodash");
const { PLAYER_ROLE, CONNOISSEUR_ROLE, N_CARD_REQUIREMENT } = require("./const");

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

  setConnoisseur() {
    this.role = CONNOISSEUR_ROLE;
  }

  resetRole() {
    this.role = PLAYER_ROLE;
  }

  isConnoisseur() {
    return this.role === CONNOISSEUR_ROLE;
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

  removeCards(cids) {
    return _.remove(this.hand, c => cids.includes(c.id));
  }

  enoughCards() {
    return this.hand.length === N_CARD_REQUIREMENT;
  }

  needCards() {
    return N_CARD_REQUIREMENT - this.hand.length;
  }

  activate(socket) {
    this.active = true;
    this.socket = socket;
  }

  deactivate() {
    this.active = false;
    this.socket = undefined;
  }

  infoJson() {
    return {
      name: this.name,
      isAdmin: this.isAdmin,
      active: this.active,
      role: this.role,
    };
  }

  pointsJson() {
    return {
      name: this.name,
      points: this.points,
    }
  }

  send(event, data) {
    if (this.socket !== undefined) {
      this.socket.emit(event, data);
    }
  }

  sendHand() {
    this.send('hand', { 'hand' : this.hand.map(c => c.json()) });
  }
}

module.exports = Player;
