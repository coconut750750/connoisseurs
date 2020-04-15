import React from 'react';

import Card from './Card';

export default function CardStack(props) {
  return (
    <div>
      {props.cards.map((c, index) => 
          <Card
            card={c}
            color={"white"}
            height={index !== props.cards.length - 1 ? "short" : ""}/>
      )}
    </div>
  );
}