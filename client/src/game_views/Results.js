import React from 'react';

import ScoreBoard from '../game_components/ScoreBoard';

export default function Results(props) {
  return (
    <div>
      <h6>Results</h6>
      <br/>

      <ScoreBoard
        players={props.players}
        scoreboard={props.results.scoreboard}/>
      <br/>

      <button type="button" className="btn btn-light" onClick={ () => props.socket.emit('toLobby', {}) }>New Game</button>
    </div>
  );
}