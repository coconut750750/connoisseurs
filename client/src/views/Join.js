import React, { useState, useCallback } from 'react';
import debounce from "lodash/debounce";

import { checkName, checkCode } from '../api/register';

function Join(props) {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [gameCode, setGameCode] = useState("");

  const debounceDisappear = () => setMessage("");
  const disappearCallback = useCallback(debounce(debounceDisappear, 5000), []);

  const joinGame = async () => {
    checkCode(gameCode).then(res => {
      if (!res.valid) {
        setMessage(res.message);
        disappearCallback();
        return;
      }

      checkName(name, gameCode).then(res => {
        if (!res.valid) {
          setMessage(res.message);
          disappearCallback();
          return;
        }

        props.join(gameCode, name);
      });
    });
  };

  return (
    <div>
      <h4>Join Game</h4>

      <input type="text" className="form-control" placeholder="Enter game code (4 characters)" 
        value={gameCode} 
        onChange={ e => setGameCode(e.target.value.toLowerCase()) }/>
      <br/>
      <input type="text" className="form-control" placeholder="Enter your name" 
        value={name} 
        onChange={ e => setName(e.target.value) }/>
      <br/>

      <div className="button-row d-flex justify-content-around">
        <button type="button" className="btn btn-light" onClick={props.goBack}>Back</button>
        <button type="button" className="btn btn-light" onClick={ () => joinGame() }>Join</button>
      </div>

      {message && <div className="alert alert-danger" role="alert">
        {message}
      </div>}
    </div>
  );
}

export default Join;