import React from 'react';
import _ from 'lodash';

import Donate from '../components/Donate';
import Card from '../game_components/Card';

import BlackCard from '../models/blackcard';
import WhiteCard from '../models/whitecard';

let displays = [
  [new BlackCard(0, 'Hey baby, come back to my place and I’ll show you ___.', 1), new WhiteCard(1, 'A PowerPoint presentation.')],
  [new BlackCard(0, "This is the prime of my life. I'm young, hot, and full of ___.", 1), new WhiteCard(1, 'Crippling debt.')],
  [new BlackCard(0, "What helps Obama unwind?", 1), new WhiteCard(1, 'Michelle Obama\'s arms.')],
  [new BlackCard(0, "After blacking out during New Year's Eve, I was awoken by ___.", 1), new WhiteCard(1, 'Another shitty year.')],
  [new BlackCard(0, "I drink to forget ___.", 1), new WhiteCard(1, 'My relationship status.')],
];

function Home(props) {
  const randomDisplays = _.sampleSize(displays, 2);
  console.log(randomDisplays);

  return (
    <div id="home">
      <div className="btn-group-vertical">
        <button type="button" className="btn btn-dark" onClick={props.joinGame}>Join Game</button>
        <button type="button" className="btn btn-dark" onClick={props.createGame}>Create Game</button>
        <button type="button" className="btn btn-dark" onClick={props.viewHowTo}>How to Play</button>
      </div>

      <br/>
      <br/>
      
      <Donate/>

      <div className="display-outer">
        <div id="display-1" className="card-display">
          {randomDisplays[0].map(c => <Card key={c.id} card={c} small/>)}
        </div>
        <div id="display-2" className="card-display">
          {randomDisplays[1].map(c => <Card key={c.id} card={c} small/>)}
        </div>
      </div>

    </div>
  )
}

export default Home;