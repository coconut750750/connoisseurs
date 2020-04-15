import React, { useState } from 'react';

import Card from "./Card";

import "./Hand.css";

export default function Hand(props) {
  const renderCards = () => {
    let rendered = [];
    for (let c of props.hand) {
      rendered.push(
        <Card
          key={c.id}
          card={c}
          color="white"
          toggled={props.selected.map(k => k.id).includes(c.id)}
          onClick={ () => props.select(c) }/>
      );
    }
    return rendered;
  };

  return (
    <div>
      <div className="hand">
        {renderCards()}
      </div>

      <br/>
      <button type="button" className="btn btn-light" onClick={ () => props.submit() }>Submit</button>
    </div>
  );
}