import React, { useState } from 'react';

import PlayerList from '../components/PlayerList';
import Hand from '../game_components/Hand';
import Card from '../game_components/Card';
import CardStack from '../game_components/CardStack';

import "./Table.css";

export default function Table(props) {
  const [selected, setSelected] = useState([]);

  const updateSelected = (card, prevSelected) => {
    if (prevSelected.map(k => k.id).includes(card.id)) {
      setSelected(prevSelected.filter(k => k.id !== card.id));
    } else {
      setSelected([...prevSelected, card]);
    }
  };

  const canSelect = () => {
    return props.played.length === 0 && !props.me.isConnoisseur();
  };

  const submit = (selected) => {
    props.socket.emit('playWhite', { cids: selected.map(k => k.id) });
    setSelected([]);
  };

  const renderCardStackList = (stacks) => {
    return (
      <div>
        {stacks.map(stack => (
          <CardStack
            cards={stack}/>
        ))}
      </div>
    );
  }

  const renderSelection = (selected, played) => {
    if (played.length === 0) {
      return <CardStack cards={selected}/>;
    } else {
      return <CardStack cards={played}/>;
    }
  };

  const renderReveal = (revealed) => {
    // return renderCardStackList(revealed);
  }

  return (
    <div>
      <h5>Table</h5>
      <br/>
      
      <PlayerList
        players={props.players}/>
      <br/>

      <Hand
        hand={props.hand}
        canSelect={canSelect()}
        selected={selected}
        select={ (card) => updateSelected(card, selected)}/>
      <br/>
      {props.selection &&
      <button type="button" className="btn btn-light" disabled={!canSelect()} onClick={ () => submit(selected) }>Submit</button>
      }

      <div className="board">
        <Card
          card={props.blackcard}
          color={"black"}/>

        {props.selection && renderSelection(selected, props.played)}
        {props.reveal && renderReveal(props.revealed)}
      </div>
      <br/>

    </div>
  );
}