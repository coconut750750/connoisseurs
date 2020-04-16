import React, { useState } from 'react';

import PlayerList from '../components/PlayerList';
import Hand from '../game_components/Hand';
import Card from '../game_components/Card';
import CardStack from '../game_components/CardStack';

import "./Table.css";

const SELECTION = "selection";
const REVEAL = "reveal";
const JUDGING = "judging";
const WINNER = "winner";

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

  const playWhite = (selected) => {
    props.socket.emit('playWhite', { cids: selected.map(k => k.id) });
    setSelected([]);
  };

  const renderAction = (phase, me) => {
    if (phase === SELECTION) {
      return (
        <button type="button" className="btn btn-light" disabled={!canSelect()} onClick={ () => playWhite(selected) }>Submit</button>
      );
    }
  };

  const renderWhiteBoard = (phase, selected, played, revealed) => {
    if (phase === SELECTION) {
      if (played.length === 0) {
        return <CardStack cards={selected}/>;
      } else {
        return <CardStack cards={played}/>;
      }
    } else if (phase === REVEAL) {
      return revealed.map(stack => (
        <CardStack
          cards={stack}/>
      ));
    }
  };

  return (
    <div>
      <h5>Table</h5>
      <br/>
      
      <PlayerList
        players={props.players}/>
      <br/>

      <Hand
        hand={props.hand}
        active={!props.me.isConnoisseur()}
        canSelect={canSelect()}
        selected={selected}
        select={ (card) => updateSelected(card, selected)}/>
      <br/>
      {renderAction(props.phase, props.me)}

      <div className="board">
        <Card
          card={props.blackcard}
          color={"black"}/>

        {renderWhiteBoard(props.phase, selected, props.played, props.revealed)}
      </div>
      <br/>

    </div>
  );
}