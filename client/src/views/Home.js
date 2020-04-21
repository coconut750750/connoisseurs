import React from 'react';

function Home(props) {
  return (
    <div>
      <div className="button-row d-flex justify-content-around">
        <button type="button" className="btn btn-dark" onClick={props.joinGame}>Join Game</button>
        <button type="button" className="btn btn-dark" onClick={props.createGame}>Create Game</button>
      </div>

      <div className="button-row d-flex justify-content-around">
        <button type="button" className="btn btn-dark" onClick={props.viewHowTo}>How to Play</button>
      </div>
    </div>
  )
}

export default Home;