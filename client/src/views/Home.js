import React from 'react';

import Donate from '../components/Donate';
import Card from '../game_components/Card';

function Home(props) {
  return (
    <div id="home">
      <div className="row">
        <div className="col-4">
        </div>
        <div className="col-4">
          <div className="btn-group-vertical">
            <button type="button" className="btn btn-dark" onClick={props.joinGame}>Join Game</button>
            <button type="button" className="btn btn-dark" onClick={props.createGame}>Create Game</button>
            <button type="button" className="btn btn-dark" onClick={props.viewHowTo}>How to Play</button>
          </div>

          <br/>
          <br/>
          
          <Donate/>
        </div>
        <div className="col-4">
        </div>
      </div>
    </div>
  )
}

export default Home;