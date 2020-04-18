const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require("path");

const setsPath = path.join(__dirname, `./game/sets/`);
const files = fs.readdirSync(setsPath);

router.get('/sets', (req, res) => {
  res.send(files);
});

module.exports = router;
