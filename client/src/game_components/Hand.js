import React from 'react';

import Card from "./Card";

import "./Hand.css";

export default function Hand(props) {
  const renderCards = () => {
    let rendered = [];
    for (let [index, c] of props.hand.entries()) {
      rendered.push(
        <Card
          style={{ left: -80 * index }}
          key={c.id}
          card={c}
          color={"white"}
          active={props.active}
          toggled={props.selected.map(k => k.id).includes(c.id)}
          onClick={ (card) => { if (props.canSelect) props.select(card); } }/>
      );
    }
    return rendered;
  };

  return (
    <div>
      <div className="hand">
        {renderCards()}
      </div>
    </div>
  );
}