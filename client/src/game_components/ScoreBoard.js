import React from 'react';

import PlayerBadge from '../components/PlayerBadge';

export default function ScoreBoard(props) {
  return (
    <div className="d-flex justify-content-center" style={{ flexWrap: "wrap" }}>
      {props.players.map( player => 
        <div>
          <PlayerBadge
            key={player.name}
            danger={!props.ready.includes(player.name)}
            player={player}/>
          <h6>{props.scoreboard.getPoints(player.name)}</h6>
        </div>
      )}
    </div>
  );
}