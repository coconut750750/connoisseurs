import React, { useState, useEffect } from 'react';

import ScoreBoard from '../game_components/ScoreBoard';
import Hand from '../game_components/Hand';
import Board from '../game_components/Board';
import Deck from '../game_components/Deck';

import WhiteCard from '../models/whitecard';

import "./Table.css";

const SELECTION = "selection";
const REVEAL = "reveal";
const JUDGING = "judging";
const WINNER = "winner";

export default function Table(props) {
  const [selected, setSelected] = useState([]);
  const [selectedWinner, setSelectedWinner] = useState(new WhiteCard(-1, ""));

  useEffect(() => {
    if (selected.length != 0 && props.phase != SELECTION) {
      setSelected([]);
    }
  }, [props.phase, selected]);

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

  const canPlay = () => {
    return !alreadyPlayed() && !props.me.isConnoisseur();
  };

  const playWhite = (selected) => {
    props.socket.emit('playWhite', { cids: selected.map(k => k.id) });
    setSelected([]);
  };

  const swapWhite = (selected) => {
    props.socket.emit('swapWhite', { cids: selected.map(k => k.id) });
    setSelected([]);
  }

  const renderHeader = () => {
    if (props.phase === SELECTION) {
      if (canPlay()) {
        return "Make your selection";
      } else {
        return "Waiting for other players to choose...";
      }
    } else if (props.phase === REVEAL) {
      if (props.me.isConnoisseur()) {
        return "Revealing the white cards";
      } else {
        return "Waiting for the connoisseur to reveal white cards...";
      }
    } else if (props.phase === JUDGING) {
      if (props.me.isConnoisseur()) {
        return "Choose a winner";
      } else {
        return "Waiting for the connoisseur to choose a winner...";
      }
    } else if (props.phase === WINNER) {
      return `${props.winner} wins!`;
    }
  };

  const renderActionButtons = (selectedWinner) => {
    if (props.phase === SELECTION) {
      return [
        <button type="button" className="btn btn-dark" disabled={!canPlay()} onClick={ () => playWhite(selected) }>Submit</button>,
        <button type="button" className="btn btn-dark" onClick={ () => swapWhite(selected) }>Swap</button>
      ];
    } else if (props.phase === REVEAL) {
      return [
        <button type="button" className="btn btn-dark"
          disabled={!props.me.isConnoisseur()}
          onClick={ () => props.socket.emit('revealWhite', {}) }>Reveal Next</button>,
        <button type="button" className="btn btn-dark"
          disabled={!props.me.isConnoisseur()}
          onClick={ () => props.socket.emit('revealWhites', {}) }>Reveal All</button>
      ];
    } else if (props.phase === JUDGING) {
      return [
        <button type="button" className="btn btn-dark"
          disabled={!props.me.isConnoisseur() || selectedWinner.id === -1}
          onClick={ () => props.socket.emit('selectWinner', { cid: selectedWinner.id }) }>Select Winner</button>
      ];
    } else if (props.phase === WINNER) {
      return [
        <button type="button" className="btn btn-dark"
          onClick={ () => props.socket.emit('startRound', {}) }>Next Round</button>,
        <button type="button" className="btn btn-dark"
          onClick={ () => props.socket.emit('seeResults', {}) }>See Results</button>
      ];
    }
  };

  return (
    <div>
      <h6>{renderHeader(props.phase, props.played.length === 0, props.me.isConnoisseur(), props.winner)}</h6>
      
      <ScoreBoard
        players={props.players}
        ready={props.ready}
        scoreboard={props.scoreboard}/>

      <div className="above-board">
        <Deck
          shuffle={ () => props.socket.emit('shuffle', {}) }
          deckinfo={props.deckinfo}/>
        <br/>
      </div>

      <Board
        phase={props.phase}
        blackcard={props.blackcard}
        reveals={props.reveals}
        selected={selected}
        played={props.played}
        winCards={props.winCards}
        alreadyPlayed={alreadyPlayed()}
        isConnoisseur={props.me.isConnoisseur()}
        selectedWinner={selectedWinner}
        setSelectedWinner={setSelectedWinner}/>


      <div className="below-board">
        <br/>

        <div className="d-flex justify-content-around">
          {renderActionButtons(selectedWinner)}
        </div>
        
        <br/>

        <Hand
          hand={props.hand}
          canSelect={props.phase === SELECTION}
          selected={props.phase === SELECTION ? selected : []}
          select={ (card) => updateSelected(card, selected)}/>
      </div>
    </div>
  );
}