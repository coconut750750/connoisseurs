class WhiteCard {
  constructor(id, text) {
    this.id = id;
    this.text = text;
  }

  json() {
    return { id: this.id, text: this.text };
  }
}

module.exports = WhiteCard;