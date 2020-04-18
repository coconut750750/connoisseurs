import React, { useState, useEffect } from 'react';

import PlayerList from '../components/PlayerList';

import { getSets } from '../api/game';

import "./Lobby.css";

const DEFAULT = "Base Set";

export default function Lobby(props) {
  const [sets, setSets] = useState([]);
  const [selected, setSelected] = useState([]);

  const canRenderAdmin = () => {
    return props.me !== undefined && props.me.isAdmin;
  }

  const startGame = (selected) => {
    props.socket.emit('startGame', { options: {sets: selected}});
  }

  useEffect(() => {
    getSets().then(data => {
      setSets(data);
      setSelected([DEFAULT]);
    });
  }, []);

  const updateSelected = (set, prevSelected) => {
    if (prevSelected.includes(set)) {
      setSelected(prevSelected.filter(k => k !== set));
    } else {
      setSelected([...prevSelected, set]);
    }
  };

  const toggleSelected = (sets, prevSelected) => {
    if (prevSelected.length === sets.length) {
      setSelected([]);
    } else {
      setSelected(sets);
    }
  };

  const renderSets = (sets, selected) => {
    return sets.map(setName => 
      <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" id={setName}
          onChange={ e => updateSelected(setName, selected) }
          checked={ selected.includes(setName) }/>
        <label class="custom-control-label" for={setName}>{setName}</label>
      </div>
    );
  };

  const renderSetSelection = (sets, selected) => {
    return (
      <div>
        <button type="button" className="btn btn-light btn-sm" onClick={ () => toggleSelected(sets, selected) }>Toggle All</button>
        <br/>
        <br/>
        {renderSets(sets, selected)}
      </div>
    )
  };
  
  return (
    <div>
      <h6>Waiting for players...</h6>
      <br/>

      <div className="row">
        <div className="col-3">
          { canRenderAdmin() ? renderSetSelection(sets, selected) : undefined }
        </div>
        <div className="col-6">
          <PlayerList
            players={props.players}
            remove={ canRenderAdmin() ? ((player) => props.socket.emit('removePlayer', { name: player.name })) : undefined }
            removeExempt={props.me}/>
          <br/>

          {canRenderAdmin() &&
            <button type="button" className="btn btn-light" onClick={ () => startGame(selected) }>Start Game</button>
          }
        </div>
        <div className="col-3"></div>
      </div>
    </div>
  );
}