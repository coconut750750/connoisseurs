const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require("path");

const setsPath = path.join(__dirname, `./game/sets/`);
const files = fs.readdirSync(setsPath);

const order = ['Base Set', 'The First Expansion', 'The Second Expansion', 'The Third Expansion', 'The Fourth Expansion', 'The Fifth Expansion', 'The Sixth Expansion', 'Green Box Expansion', '90s Nostalgia Pack', 'Box Expansion', 'Fantasy Pack', 'Food Pack', 'Science Pack', 'World Wide Web Pack', 'Vote for Hillary Pack', 'Vote for Trump Pack', 'Trump Survival Pack', '2012 Holiday Pack', '2013 Holiday Pack', 'PAX East 2013', 'PAX Prime 2013', 'PAX East 2014', 'PAX East 2014 Panel Pack', 'PAX Prime 2014 Panel Pack', 'PAX Prime 2015 Food Packs', 'House of Cards Against Humanity', 'Reject Pack', 'Reject Pack 2', 'Canadian'];

router.get('/sets', (req, res) => {
  let filesAvailable = [];
  order.forEach(string => {
    if (files.includes(string)) {
      filesAvailable.push(string);
    }
  })
  res.send(filesAvailable);
});

module.exports = router;
