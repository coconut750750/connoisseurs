function socketio(socket, game, name, player) {
  socket.on('startGame', data => {
    if (game.canStart() && player.isAdmin) {
      if (game.enoughPlayers()) {
        const { options } = data;
        game.start(options);
      } else {
        socket.emit('message', { message: 'Not enough players have joined the game' });
      }
    }
  });

  socket.on('drawBlack', data => {

  });

  socket.on('playWhite', data => {

  });

  socket.on('replaceWhite', data => {

  });

  socket.on('revealWhite', data => {

  });

  socket.on('revealWhites', data => {

  });

  socket.on('selectWinner', data => {

  });

  socket.on('newRound', data => {
    // game.roundStart
  });

  socket.on('seeResults', data => {

  });

  socket.on('toLobby', data => {

  });

  socket.on('removePlayer', data => {

  });

  // reconnections
  socket.on('getPhase', data => {

  });

  socket.on('getBlack', data => {

  });

  socket.on('getWhites', data => {

  });

  socket.on('getHand', data => {

  });

  socket.on('getPoints', data => {

  });

  socket.on('getDeckInfo', data => {

  });
}

module.exports = socketio;
