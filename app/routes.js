const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require("path");

const wordlistPath = path.join(__dirname, `./game/wordfiles/`);
const files = fs.readdirSync(wordlistPath);

router.get('/wordlists', (req, res) => {
  res.send(files);
});

module.exports = router;
