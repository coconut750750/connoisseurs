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
    for (let [index, c] of props.hand.entries()) {
      rendered.push(
        <div className="hovercard" style={{ left: -75 * index }} key={c.id}>
          <div className={cardInteractClass()} onClick={ () => { if (props.canSelect) props.select(c); } }/>
          <Card
            card={c}
            color={"white"}
            toggled={props.selected.map(k => k.id).includes(c.id)}/>
        </div>
      );
    }
    return rendered;
  };

  return (
    <div className="hand">
      {renderCards()}
    </div>
  );
}