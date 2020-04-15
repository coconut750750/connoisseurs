import React, { useState, useCallback } from 'react';
import debounce from "lodash/debounce";

import { checkName, createGame } from '../api/register';

function Create(props) {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  const debounceDisappear = () => setMessage("");
  const disappearCallback = useCallback(debounce(debounceDisappear, 5000), []);

  const create = async () => {
    checkName(name).then(res => {
      if (!res.valid) {
        setMessage(res.message);
        disappearCallback();
        return;
      }

      createGame({}).then(res => {
        props.setGame(res.gameCode, name);
      });
    });
  }

  return (
    <div>
      <h4>Create Game</h4>

      <input type="text" className="form-control" placeholder="Enter your name" value={name} onChange={ e => setName(e.target.value) }/>
      <br />

      <div className="button-row d-flex justify-content-around">
        <button type="button" className="btn btn-light" onClick={props.goBack}>Back</button>
        <button type="button" className="btn btn-light" onClick={ () => create() }>Create</button>
      </div>

      {message && <div className="alert alert-danger" role="alert">
        {message}
      </div>}
    </div>
  )
}

export default Create;