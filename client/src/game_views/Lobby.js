import React from 'react';

import PlayerList from '../components/PlayerList';

export default function Lobby(props) {
  const canRenderAdmin = () => {
    return props.me !== undefined && props.me.isAdmin;
  }

  const startGame = () => {
    props.socket.emit('startGame', { options: {sets: ['Base Set']}});
  }
  
  return (
    <div>
      <h6>Waiting for players...</h6>
      <br/>

      <PlayerList
        players={props.players}
        remove={ canRenderAdmin() ? ((player) => props.socket.emit('removePlayer', { name: player.name })) : undefined }
        removeExempt={props.me}/>
      <br/>

      {canRenderAdmin() &&
        <button type="button" className="btn btn-light" onClick={ () => startGame() }>Start Game</button>
      }
    </div>
  );
}