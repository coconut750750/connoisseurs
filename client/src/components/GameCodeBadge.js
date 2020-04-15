import React from 'react';

const style = {
    boxShadow: "0px 0px 5px 0px #21252999",
}

function GameCodeBadge(props) {
  return (
    <h6>Game code: <span className="badge badge-secondary badge-light" style={style}>{props.gameCode}</span></h6>
  );
}

export default GameCodeBadge;
