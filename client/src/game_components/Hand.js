import React from 'react';

import Card from "./Card";

import "./Hand.css";

export default function Hand(props) {
  const cardInteractClass = () => {
    const active = props.canSelect ? "active" : "";
    return `card-hover ${active}`;
  };

  const renderCards = () => {
    let rendered = [];
    for (let c of props.hand.cards) {
      rendered.push(
        <div className="hovercard" key={c.id}>
          <div className={cardInteractClass()} onClick={ () => { if (props.canSelect) props.select(c); } }/>
          <Card
            card={c}
            toggled={props.selected.map(k => k.id).includes(c.id)}/>
        </div>
      );
    }
    return rendered;
  };

  return (
    <div>
      <div className="d-flex justify-content-end">
        <span class="material-icons">autorenew</span>
        <h6>{props.hand.swaps}</h6>
      </div>
      <div className="hand">
        {renderCards()}
      </div>
    </div>
  );
}