import React from 'react';

import Card from './Card';

import "./CardStack.css";

export default function CardStack(props) {
  const getClass = () => {
    return `stack ${props.highlighted ? "highlighted" : ""}`;
  };

  return (
    <div className={getClass()}>
      {props.cards.map((c, index) => 
          <Card
            key={c.id}
            card={c}
            active={props.active}
            short={index !== props.cards.length - 1}
            onClick={props.onClick}/>
      )}
    </div>
  );
}