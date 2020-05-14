const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require("path");

const setsPath = path.join(__dirname, `./game/sets/`);
const files = fs.readdirSync(setsPath);

const BOXES = ['Base Set', 'Red Box', 'Blue Box', 'Green Box', 'Absurd Box'];
const PACKS = ["2000s Nostalgia Pack", "90’s Nostalgia Pack", "A.I. Pack", "Ass Pack", "Bigger Blacker Box", "Blackbox Press Kit", "Cards Against Humanity Saves America", "Chosen People Pack", "College Pack", "Dad Pack", "Desert Bus For Hope Pack", "Fantasy Pack", "Fascism Pack", "Food Pack", "Geek Pack", "Gen Con 2018 Midterm Election Pack", "Hanukkah LOL Pack", "Hawaii 2 Safe Cards", "Hidden Compartment Pack", "Hidden Gems Bundle", "Holiday Pack 2012", "Holiday Pack 2013", "Holiday Pack 2014", "House Of Cards Pack", "Human Pack", "Jack White Show Pack", "Mass Effect Pack", "Non Denominational Seasons Greetings Pack", "Period Pack", "Post-Trump Pack", "Pride Pack", "Reject Pack", "Reject Pack 2", "Reject Pack 3", "Retail Pack", "Sci-Fi Pack", "Science Pack", "Tabletop Pack", "Theatre Pack", "Vote For Hillary Pack", "Vote For Trump Pack", "Weed Pack", "World Wide Web Pack"];

const order = BOXES.concat(PACKS);

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
