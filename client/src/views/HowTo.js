import React from 'react';

function HowTo(props) {
  return (
    <div id="howto" className="text-left">
      <h4>How To Play</h4>

      <p>Connoisseurs is a party game for horrible people based off the popular game Cards Against Humanity.</p>
      <br/>

      <p>To start, each player is dealt ten white cards and a "Connoisseur" is chosen at random. The Connoisseur draws a black card, reads it, and displays it to the other players. All other players try to fill in the blank(s) or answer the prompt on the black card with their white cards.</p>
      <br/>

      <p>Once everyone submits a white card, the Connoisseur reads all the answers, and chooses their favorite response. That person gets a point and becomes the next Connoisseur.</p>
      <br/>

      <p>This repeats until you get bored.</p>
      <br/>

      <button type="button" className="btn btn-dark" onClick={props.goBack}>Back</button>
    </div>
  );
}

export default HowTo;