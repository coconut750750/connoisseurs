import React from 'react';

import "./Card.css"

export default function Card(props) {
  const getClass = () => {
    return `card ${props.color} ${props.toggled ? "toggled" : ""} ${props.height}`;
  }

  return (
    <div className={getClass()} onClick={ () => { if (props.onClick !== undefined) props.onClick(); } }>
      <div className="card-body">
        <h6 className="card-title">{props.card !== undefined ? props.card.text : ""}</h6>
      </div>
    </div>
  );
}