import React from 'react';

import "./Card.css"

export default function Card(props) {
  const getDisplayClass = () => {
    const toggled = props.toggled ? "toggled" : "";
    const active = props.active ? "active" : "";
    const heightClass = props.short ? "short" : "";
    return `card ${props.color} ${toggled} ${active} ${heightClass}`;
  }

  return (
    <div className={getDisplayClass()}  onClick={ () => { if (props.onClick !== undefined) props.onClick(props.card); } }>
      <div className="card-body">
        <h6 className="text-left">{props.card !== undefined ? props.card.text : ""}</h6>
      </div>
    </div>
  );
}