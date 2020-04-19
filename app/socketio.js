function socketio(socket, game, name, player) {
  socket.on('startGame', data => {
    if (player.isAdmin) {
      try {
        const { options } = data;
        game.start(options.sets, options.swaps);
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
  socket.on('getPhase', data => {
    socket.emit('phase', { phase: game.phase });
  });

  socket.on('getBlack', data => {
    game.reconnectSendBlack(player);
  });

  socket.on('getRevealed', data => {
    game.reconnectSendRevealed(player);
  });

  socket.on('getWinner', data => {
    game.reconnectSendWinner(player);
  })

  socket.on('getHand', data => {
    player.sendHand();
  });

  socket.on('getPlayed', data => {
    game.notifyPlayed(player);
  });

  socket.on('getPoints', data => {
    game.reconnectSendPoints(player);
  });

  socket.on('getDeckInfo', data => {
    game.reconnectSendDeckInfo(player);
  });

  socket.on('getResults', data => {
    game.reconnectSendResults(player);
  });
}

module.exports = socketio;
