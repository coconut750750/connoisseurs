import React from 'react';

import "./Card.css"

export default function Card(props) {
  const getDisplayClass = () => {
    const toggled = props.toggled ? "toggled" : "";
    return `card ${props.color} ${toggled}`;
  }

  const getInteractClass = () => {
    const active = props.active ? "active" : "";
    return `card-hover ${active}`;
  }

  const getOuterClass = () => {
    const height = props.height !== undefined ? props.height : "";
    return `hovercard ${height}`;
  }

  return (
    <div className={getOuterClass()} style={props.style}>
      <div className={getInteractClass()} onClick={ () => { if (props.onClick !== undefined && props.active) props.onClick(props.card); } }/>
      <div className={getDisplayClass()}>
        <div className="card-body">
          <h6 className="text-left">{props.card !== undefined ? props.card.text : ""}</h6>
        </div>
      </div>
    </div>
  );
}