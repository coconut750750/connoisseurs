export default class ScoreBoard {
  constructor(json) {
    this.points = {};
    if (json !== undefined) {
      for (let player of json) {
        this.points[player.name] = player.points
      }
    }
  }

  getPoints(name) {
    if (!(name in this.points)) {
      return 0;
    }
    return this.points[name];
  }
}
