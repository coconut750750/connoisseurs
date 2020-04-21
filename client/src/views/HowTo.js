import React from 'react';

function HowTo(props) {
  return (
    <div className="text-left">
      <h4>How To Play</h4>


      <button type="button" className="btn btn-dark" onClick={props.goBack}>Back</button>
    </div>
  );
}

export default HowTo;