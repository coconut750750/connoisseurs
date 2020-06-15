function socketio(socket, game, name, player) {
  socket.on('startGame', data => {
    if (player.isAdmin) {
      try {
        const { options } = data;
        game.start(options.sets, options.roundsPerSwap);
      } catch (err) {
        socket.emit('message', { message: err.message });
      }
    }
  });

  socket.on('startRound', data => {
    try {
      game.roundStart();
    } catch (err) {
      socket.emit('message', { message: err.message });
    }
  });

  socket.on('shuffle', data => {
    try {
      game.shuffleDeck();
    } catch (err) {
      socket.emit('message', { message: err.message });
    }
  });

  socket.on('playWhite', data => {
    try {
      const { cids } = data;
      game.playCards(player, cids);
    } catch (err) {
      socket.emit('message', { message: err.message });
    }
  });

  socket.on('swapWhite', data => {
    try {
      const { cids } = data;
      game.swapCards(player, cids);
    } catch (err) {
      socket.emit('message', { message: err.message });
    }
  });

  socket.on('revealWhite', data => {
    try {
      game.revealNext(player);
    } catch (err) {
      socket.emit('message', { message: err.message });
    }
  });

  socket.on('revealWhites', data => {
    try {
      game.revealRest(player);
    } catch (err) {
      socket.emit('message', { message: err.message });
    }
  });

  socket.on('selectWinner', data => {
    try {
      const { cid } = data;
      game.selectWinner(player, cid);
    } catch (err) {
      socket.emit('message', { message: err.message });
    }
  });

  socket.on('seeResults', data => {
    try {
      game.endGame();
    } catch (err) {
      socket.emit('message', { message: err.message });
    }
  });

  socket.on('toLobby', data => {
    if (!game.started) {
      game.reset();
    }
  });

  socket.on('removePlayer', data => {
    if (!game.started || player.isAdmin) {
      const { name } = data;
      game.removePlayer(name);
    }
  });

  // reconnections
  socket.on('getReconnect', data =>{
    socket.emit('phase', { phase: game.phase });
    game.reconnectSendBlack(player);
    game.reconnectSendReady(player);
    game.reconnectSendRevealed(player);
    game.reconnectSendWinner(player);
    player.sendHand();
    game.notifyPlayed(player);
    game.reconnectSendPoints(player);
    game.reconnectSendDeckInfo(player);
    game.reconnectSendResults(player);
  });
}

module.exports = socketio;
