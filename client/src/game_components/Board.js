import React, { useState } from 'react';

import useWindowResize from '../components/UseWindowResize';

import Card from '../game_components/Card';
import CardStack from '../game_components/CardStack';

import "./Board.css";

const SELECTION = "selection";
const REVEAL = "reveal";
const JUDGING = "judging";
const WINNER = "winner";

export default function Board(props) {
  const calcScale = () => Math.min(window.innerWidth / 640, 1);
  const [scale, setScale] = useState(calcScale());
  const updateScale = () => {
    setScale(calcScale());
  };
  useWindowResize(updateScale);

  const renderWhiteBoard = () => {
    if (props.phase === SELECTION) {
      if (!props.alreadyPlayed) {
        return <CardStack
                  cards={props.selected}/>;
      } else {
        return <CardStack
                  cards={props.played}/>;
      }
    } else if (props.phase === REVEAL) {
      return props.reveals.map(stack => (
        <CardStack
          cards={stack}/>
      ));
    } else if (props.phase === JUDGING) {
      return props.reveals.map(stack => (
        <CardStack
          highlighted={stack.map(k => k.id).includes(props.selectedWinner?.id)}
          active={props.isConnoisseur}
          onClick={(card) => props.setSelectedWinner(card)}
          cards={stack}/>
      ));
    } else if (props.phase === WINNER) {
      return <CardStack
                cards={props.winCards}/>;
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="board" style={{transform: `scale(${scale})`}}>
        <Card
          card={props.blackcard}/>

        {renderWhiteBoard()}
      </div>
    </div>
  );
}