import React from 'react';

const style = {
    boxShadow: "0px 0px 5px 0px #21252999",
    cursor: "pointer",
}

function GameCodeBadge(props) {
  const copyLink = () => {
    const el = document.createElement('textarea');
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    props.copySuccess();
  };

  return (
    <h6>
    Game code: <span onClick={() => copyLink()} className="badge badge-secondary badge-dark" style={style}>{props.gameCode}</span>
    </h6>
  );
}

export default GameCodeBadge;
