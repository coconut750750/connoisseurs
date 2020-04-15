import React from 'react';

import PlayerList from '../components/PlayerList';

export default function Table(props) {
  return (
    <div>
      <h5>Table</h5>
      <br/>
      
      <PlayerList
        players={props.players}/>
      <br/>

    </div>
  );
}