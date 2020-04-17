import React from 'react';

import "./Deck.css";

export default function Deck(props) {
  return (
    <div className="deck">
      <button type="button" className="btn btn-light btn-sm" onClick={ () => props.shuffle() }>Shuffle</button>
      <div className="item">
        <span className="card-icon white">{"  "}</span><h6>{props.deckinfo.whitesLeft}</h6>
      </div>
      <div className="item">
        <span className="card-icon black">{"  "}</span><h6>{props.deckinfo.blacksLeft}</h6>
      </div>
    </div>
  );
}