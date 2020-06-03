import React from 'react';

import Donate from '../components/Donate';

function Home(props) {
  return (
    <div id="home">
      <div class="btn-group-vertical">
        <button type="button" className="btn btn-dark" onClick={props.joinGame}>Join Game</button>
        <button type="button" className="btn btn-dark" onClick={props.createGame}>Create Game</button>
        <button type="button" className="btn btn-dark" onClick={props.viewHowTo}>How to Play</button>
      </div>

      <br/>
      <br/>
      
      <Donate/>
    </div>
  )
}

export default Home;