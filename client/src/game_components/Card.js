import React from 'react';

import "./Card.css"

export default function Card(props) {
  const getClass = () => {
    const active = props.active ? "active" : "";
    const toggled = props.toggled ? "toggled" : "";
    const height = props.height !== undefined ? props.height : "";
    return `card ${props.color} ${active} ${toggled} ${height}`;
  }

  return (
    <div className={getClass()} onClick={ () => { if (props.onClick !== undefined && props.active) props.onClick(props.card); } }>
      <div className="card-body">
        <h6 className="text-left">{props.card !== undefined ? props.card.text : ""}</h6>
      </div>
    </div>
  );
}