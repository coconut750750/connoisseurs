import React from 'react';

import PlayerBadge from './PlayerBadge';

function PlayerList(props) {
  return (
    <div className="d-flex justify-content-center" style={{ flexWrap: "wrap" }}>
      {props.players.map( player => 
        <PlayerBadge
          key={player.name}
          player={player}
          remove={props.removeExempt === player ? undefined : props.remove}/>
      )}
    </div>
  );
}

export default PlayerList;
