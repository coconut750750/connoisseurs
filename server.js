const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server, {
  pingInterval: 15000,
  pingTimeout: 30000
});

const Game = require('./app/game');
const GameManager = require('./app/manager');
const gameSocketio = require('./app/socketio');

const registerRouter = require("./app/register");
const gameRouter = require("./app/routes")

const port = process.env.PORT || 5000;
const dev = process.env.NODE_ENV !== 'production';

app.use(bodyParser.json());
app.io = io;
app.gm = new GameManager(dev);

app.get('/ping', (req, res) => {
  res.send();
});

app.use(function(req, res, next) {
  req.gm = app.gm;
  req.io = app.io;
  next();
});
app.use("/register/", registerRouter);
app.use("/game/", gameRouter);

app.io.on('connect', function (socket) {
  var game;
  var name;
  var player;

  socket.on('joinGame', data => {
    name = data.name;
    game = app.gm.retrieveGame(data.gameCode);
    if (!(game instanceof Game)) {
      return;
    }
    socket.join(data.gameCode);

    if (game.playerExists(name)) {
      game.activatePlayer(name, socket);
    } else {
      game.addPlayer(name, socket);
    }
    player = game.getPlayer(name);

    gameSocketio(socket, game, name, player);
  });

  socket.on('exitGame', data => {
    if (player.isAdmin) {
      game.delete();
    } else if (game.hasStarted()) {
      game.deactivatePlayer(name);
    } else {
      game.removePlayer(name);
    }
  });

  socket.on('disconnect', data => {
    if (game !== undefined && game.playerExists(name)) {
      game.deactivatePlayer(name);
    }
  });
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

server.listen(port, () => console.log(`Listening on port ${port}`));
