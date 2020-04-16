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
            card={c}
            color={"white"}
            active={props.active}
            height={index !== props.cards.length - 1 ? "short" : ""}
            onClick={props.onClick}/>
      )}
    </div>
  );
}