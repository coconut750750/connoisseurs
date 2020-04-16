import ScoreBoard from './scoreboard';

export default class Results {
  constructor(scoreboard) {
    this.scoreboard = scoreboard;
    if (scoreboard === undefined) {
      this.scoreboard = new ScoreBoard();
    }
  }
}
