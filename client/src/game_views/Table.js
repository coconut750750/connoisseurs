import React, { useState } from 'react';

import ScoreBoard from '../game_components/ScoreBoard';
import Hand from '../game_components/Hand';
import Card from '../game_components/Card';
import CardStack from '../game_components/CardStack';
import DeckInfo from '../game_components/DeckInfo';

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

  const alreadyPlayed = () => {
    return props.played.length !== 0;
  };

  const canSelect = () => {
    return !alreadyPlayed() && !props.me.isConnoisseur();
  };

  const playWhite = (selected) => {
    props.socket.emit('playWhite', { cids: selected.map(k => k.id) });
    setSelected([]);
  };

  const renderHeader = () => {
    if (props.phase === SELECTION) {
      if (canSelect()) {
        return <h6>Make your selection</h6>;
      } else {
        return <h6>Waiting for other players to choose...</h6>;
      }
    } else if (props.phase === REVEAL) {
      if (props.me.isConnoisseur()) {
        return <h6>Revealing the white cards</h6>;
      } else {
        return <h6>Waiting for the connoisseur to reveal white cards...</h6>;
      }
    } else if (props.phase === JUDGING) {
      if (props.me.isConnoisseur()) {
        return <h6>Choose a winner</h6>;
      } else {
        return <h6>Waiting for the connoisseur to choose a winner...</h6>;
      }
    } else if (props.phase === WINNER) {
      return <h6>{`${props.winner} wins!`}</h6>;
    }
  };

  const renderAction = (selectedWinner) => {
    if (props.phase === SELECTION) {
      return (
        <button type="button" className="btn btn-light" disabled={!canSelect()} onClick={ () => playWhite(selected) }>Submit</button>
      );
    } else if (props.phase === REVEAL) {
      return [
        <button type="button" className="btn btn-light"
          disabled={!props.me.isConnoisseur()}
          onClick={ () => props.socket.emit('revealWhite', {}) }>Reveal Next</button>,
        <button type="button" className="btn btn-light"
          disabled={!props.me.isConnoisseur()}
          onClick={ () => props.socket.emit('revealWhites', {}) }>Reveal All</button>,
      ];
    } else if (props.phase === JUDGING) {
      return (
        <button type="button" className="btn btn-light"
          disabled={!props.me.isConnoisseur() || selectedWinner.id === -1}
          onClick={ () => props.socket.emit('selectWinner', { cid: selectedWinner.id }) }>Select Winner</button>
      );
    } else if (props.phase === WINNER) {
      return [
        <button type="button" className="btn btn-light"
          onClick={ () => props.socket.emit('startRound', {}) }>Next Round</button>,
        <button type="button" className="btn btn-light"
          onClick={ () => props.socket.emit('seeResults', {}) }>See Results</button>,
      ];
    }
  };

  const renderWhiteBoard = (selected, selectedWinner) => {
    if (props.phase === SELECTION) {
      if (!alreadyPlayed()) {
        return <CardStack cards={selected}/>;
      } else {
        return <CardStack cards={props.played}/>;
      }
    } else if (props.phase === REVEAL) {
      return props.reveals.map(stack => (
        <CardStack
          cards={stack}/>
      ));
    } else if (props.phase === JUDGING) {
      return props.reveals.map(stack => (
        <CardStack
          highlighted={stack.map(k => k.id).includes(selectedWinner.id)}
          active={props.me.isConnoisseur()}
          onClick={(card) => setSelectedWinner(card)}
          cards={stack}/>
      ));
    } else if (props.phase === WINNER) {
      return <CardStack cards={props.winCards}/>;
    }
  };

  return (
    <div>
      {renderHeader(props.phase, props.played.length === 0, props.me.isConnoisseur(), props.winner)}
      <br/>
      
      <ScoreBoard
        players={props.players}
        scoreboard={props.scoreboard}/>
      <br/>

      <div className="row">
        <div className="col-9"></div>
        <div className="col-3">
          <DeckInfo
            deckinfo={props.deckinfo}/>
          <br/>
        </div>
      </div>

      <div className="board">
        <Card
          card={props.blackcard}
          color={"black"}/>

        {renderWhiteBoard(selected, selectedWinner)}
      </div>

      <div className="below-board">
        <br/>

        {renderAction(selectedWinner)}
        <br/>
        <br/>

        <Hand
          hand={props.hand}
          canSelect={canSelect()}
          selected={selected}
          select={ (card) => updateSelected(card, selected)}/>
        <br/>
      </div>
    </div>
  );
}