export default class ScoreBoard {
  constructor() {
    this.points = {};
  }

  load(json) {
    for (let player of json) {
      this.points[player.name] = player.points
    }
  }

  getPoints(name) {
    if (!(name in this.points)) {
      return 0;
    }
    return this.points[name];
  }
}

export function newScoreBoard(json) {
  const scoreboard = new ScoreBoard();
  scoreboard.load(json);
  return scoreboard;
}