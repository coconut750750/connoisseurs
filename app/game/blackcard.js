class BlackCard {
  constructor(id, text, blanks) {
    this.id = id;
    this.text = text;
    this.blanks = blanks;    
  }

  json() {
    return { id: this.id, text: this.text, blanks: this.blanks };
  }
}

module.exports = BlackCard;
