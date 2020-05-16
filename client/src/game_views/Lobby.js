import React, { useState, useEffect } from 'react';

import PlayerList from '../components/PlayerList';

import { getSets } from '../api/game';

import "./Lobby.css";

const DEFAULT = "Base Set";

export default function Lobby(props) {
  const [sets, setSets] = useState([]);
  const [selected, setSelected] = useState([]);

  const [swaps, setSwaps] = useState(0);

  const canRenderAdmin = () => {
    return props.me !== undefined && props.me.isAdmin;
  };

  const startGame = (selected) => {
    props.socket.emit('startGame', { options: { sets: selected, roundsPerSwap: parseInt(swaps) }});
  };

  const exitGame = () => {
    props.socket.emit('exitGame', {});
  };

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
        <label class="custom-control-label" for={setName}><p>{setName}</p></label>
      </div>
    );
  };

  const renderSetSelection = (sets, selected) => {
    return (
      <div>
        <button type="button" className="btn btn-dark btn-sm" onClick={ () => toggleSelected(sets, selected) }>Toggle All</button>
        <br/>
        <br/>
        {renderSets(sets, selected)}
      </div>
    )
  };

  const renderSwapSelection = () => {
    return (
      <div>
        <h6>Number of rounds per card swap</h6>
        <select className="form-control" defaultValue={0} onChange={ e => setSwaps(e.target.value) }>
          <option value={0}>No card swaps</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
        </select>
      </div>
    );
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
            <div>
              {renderSwapSelection()}
              <br/>
            </div>
          }

          <div className="button-row d-flex justify-content-around">
            <button type="button" className="btn btn-dark"
              onClick={ () => exitGame() }>
              {canRenderAdmin() ? "End Game" : "Leave Game"}
            </button>
            
            {canRenderAdmin() &&
              <button type="button" className="btn btn-dark" onClick={ () => startGame(selected) }>Start Game</button>
            }
          </div>
        </div>
        <div className="col-3"></div>
      </div>
    </div>
  );
}