import React, { useState } from 'react';

import PlayerList from '../components/PlayerList';
import Hand from '../game_components/Hand';
import Card from '../game_components/Card';

import "./Table.css";

export default function Table(props) {
  const [selected, setSelected] = useState([]);

  const updateSelected = (card, prevSelected) => {
    if (prevSelected.map(k => k.id).includes(card.id)) {
      setSelected(prevSelected.filter(k => k.id !== card.id));
    } else {
      setSelected([...prevSelected, card]);
    }
  }

  return (
    <div>
      <h5>Table</h5>
      <br/>
      
      <PlayerList
        players={props.players}/>
      <br/>

      <div className="board">
        <Card
          card={props.blackcard}
          color={"black"}/>

        {
          selected.map(card => (
          <Card
            card={card}
            color={"white"}/>
        ))
        }
      </div>
      <br/>

      <Hand
        hand={props.hand}
        selected={selected}
        select={ (card) => updateSelected(card, selected)}
        submit={ () => props.socket.emit('playWhite', { cids: selected.map(k => k.id) })}/>

    </div>
  );
}