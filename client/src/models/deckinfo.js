export default class DeckInfo {
  constructor(json) {
    this.whitesLeft = 0;
    this.blacksLeft = 0;
    this.whiteDiscard = 0;
    this.blackDiscard = 0;
    if (json !== undefined) {
      this.whitesLeft = json.whitesLeft;
      this.blacksLeft = json.blacksLeft;
      this.whiteDiscard = json.whiteDiscard;
      this.blackDiscard = json.blackDiscard;
    }
  }
}