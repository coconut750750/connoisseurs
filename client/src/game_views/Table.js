import React, { useState } from 'react';

import PlayerList from '../components/PlayerList';
import Hand from '../game_components/Hand';
import Card from '../game_components/Card';
import CardStack from '../game_components/CardStack';

import WhiteCard from '../models/whitecard';

import "./Table.css";

const SELECTION = "selection";
const REVEAL = "reveal";
const JUDGING = "judging";
const WINNER = "winner";

export default function Table(props) {
  const [selected, setSelected] = useState([]);
  const [selectedWinner, setSelectedWinner] = useState(new WhiteCard(-1, ""));

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

  const renderAction = (phase, me, selectedWinner) => {
    if (phase === SELECTION) {
      return (
        <button type="button" className="btn btn-light" disabled={!canSelect()} onClick={ () => playWhite(selected) }>Submit</button>
      );
    } else if (phase === REVEAL) {
      return [
        <button type="button" className="btn btn-light"
          disabled={!props.me.isConnoisseur()}
          onClick={ () => props.socket.emit('revealWhite', {}) }>Reveal Next</button>,
        <button type="button" className="btn btn-light"
          disabled={!props.me.isConnoisseur()}
          onClick={ () => props.socket.emit('revealWhites', {}) }>Reveal All</button>,
      ];
    } else if (phase === JUDGING) {
      return (
        <button type="button" className="btn btn-light"
          disabled={!props.me.isConnoisseur() || selectedWinner.id === -1}
          onClick={ () => props.socket.emit('selectWinner', { cid: selectedWinner.id }) }>Select Winner</button>
      );
    } else if (phase === WINNER) {
      return (
        <button type="button" className="btn btn-light"
          onClick={ () => props.socket.emit('startRound', {}) }>Next Round</button>
      );
    }
  };

  const renderWhiteBoard = (phase, selected, played, reveals, selectedWinner, winCards) => {
    if (phase === SELECTION) {
      if (played.length === 0) {
        return <CardStack cards={selected}/>;
      } else {
        return <CardStack cards={played}/>;
      }
    } else if (phase === REVEAL) {
      return reveals.map(stack => (
        <CardStack
          cards={stack}/>
      ));
    } else if (phase === JUDGING) {
      return reveals.map(stack => (
        <CardStack
          highlighted={stack.map(k => k.id).includes(selectedWinner.id)}
          active={props.me.isConnoisseur()}
          onClick={(card) => setSelectedWinner(card)}
          cards={stack}/>
      ));
    } else if (phase === WINNER) {
      return <CardStack cards={winCards}/>;
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

      {renderAction(props.phase, props.me, selectedWinner)}
      <br/>
      <br/>

      <div className="board">
        <Card
          card={props.blackcard}
          color={"black"}/>

        {renderWhiteBoard(props.phase, selected, props.played, props.reveals, selectedWinner, props.winCards)}
      </div>
      <br/>

    </div>
  );
}