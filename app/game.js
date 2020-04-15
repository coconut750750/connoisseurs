class GameInterface {
  constructor(code, onEmpty, options, broadcast) {
    this.code = code;
    this.onEmpty = onEmpty;
    this.options = options;
    this.broadcast = broadcast;
  }

  playerExists(name) {
    throw new Error('Game.playerExists() implemention required!');
  }

  getPlayer(name) {
    // the object returned will be the object the server will pass into socketio
    throw new Error('Game.getPlayer() implemention required!');
  }

  addPlayer(name, socket) {
    throw new Error('Game.addPlayer() implemention required!');
  }

  removePlayer(name) {
    throw new Error('Game.removePlayer() implemention required!');
  }

  isActive(name) {
    throw new Error('Game.isActive() implemention required!');
  }

  activatePlayer(name, socket) {
    throw new Error('Game.activatePlayer() implemention required!');
  }

  deactivatePlayer(name) {
    throw new Error('Game.deactivatePlayer() implemention required!');
  }

  hasStarted() {
    // prevents new users from joining
    // prevents existing users from completely being removed
    throw new Error('Game.hasStarted() implemention required!');
  }

  delete() {
    throw new Error('Game.delete() implemention required!');
  }
}

module.exports = GameInterface;