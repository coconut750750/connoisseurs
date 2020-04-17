import React from 'react';

import "./DeckInfo.css";

export default function DeckInfo(props) {
  return (
    <div className="deck-info">
      <div className="item">
        <span className="card-icon white">{"  "}</span><h6>{props.deckinfo.whitesLeft}</h6>
      </div>
      <div className="item">
        <span className="card-icon black">{"  "}</span><h6>{props.deckinfo.blacksLeft}</h6>
      </div>
    </div>
  );
}