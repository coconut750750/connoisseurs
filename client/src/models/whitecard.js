export default class WhiteCard {
  constructor(id, text) {
    this.id = id;
    this.text = text;
  }
}

export function parseWhiteCardList(json) {
  let cards = [];
  for (let c of json) {
    cards.push(new WhiteCard(c.id, c.text));
  }
  return cards;
}