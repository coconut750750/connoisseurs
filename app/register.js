const express = require("express");
const router = express.Router();

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 12;

router.post('/create', (req, res) => {
  const game = req.gm.createGame(req.body, (code, event, data) => req.io.to(code).emit(event, data));
  
  res.send({
    gameCode: `${game.code}`
  });
});

router.get('/checkname', (req, res) => {
  const { name } = req.query;
  if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
    res.send({ valid: false, message: `Your name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters long` });
    return;
  }

  const { gameCode } = req.query;
  if (gameCode != undefined) {
    const game = req.gm.retrieveGame(gameCode);
    if (game === undefined) {
      res.send({ valid: false, message: 'Invalid game code' });
      return;
    }
    if (game.playerExists(name) && !game.isActive(name)) {
      res.send({ valid: true });
      return;
    } else if (game.playerExists(name)) {
      res.send({ valid: false, message: 'This name has been taken' });
      return;
    }
    if (game.hasStarted()) {
      res.send({ valid: false, message: 'This game is closed' });
      return;
    }
  }

  res.send({ valid: true });
});

router.get('/checkcode', (req, res) => {
  const { gameCode } = req.query;
  const game = req.gm.retrieveGame(gameCode);
  if (game != undefined) {
    res.send({ valid: true });
  } else {
    res.send({ valid: false, message: 'Invalid game code' });
  }
});

module.exports = router;
