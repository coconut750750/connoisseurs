import React from 'react';

function HowTo(props) {
  return (
    <div className="text-left">
      <h4>How To Play</h4>

      <h6>Introduction</h6>
      <p>Pseudonyms is a team-based board game based off of the popular board game Codenames. It requires at least 4 players.</p>

      <h6>Objective</h6>
      <p>The objective of the game is for each team to correctly identify and reveal their respective words based on the clues given by their Spymaster or, in Pseudonyms, their “key”.</p>

      <h6>The Setup</h6>
      <p>Players are split into two teams, a red team and a blue team. Each team elects one player to be the key.</p>
      <p>When the game starts, 25 random words from a word list are chosen and placed in a 5 by 5 grid. Each word can be one of four colors: red, blue, black, and white. There are 8 or 9 red and blue words depending on the first team to play, 7 white words, and 1 black word. Only the keys know the colors of each word.</p>
      <p>One team is chosen at random to go first. That team will 9 words to identify; the other team will have 8. If a team reveals the black word, they automatically lose. </p>

      <h6>The Clue</h6>
      <p>The key will give their team a clue that consists of one word and one number. The word should relate to the words that the key's team must reveal. The number tells the key’s team how many words are related to the clue. </p>
      <p>For example, the clue tree: 2 can refer to the words "nut" and "bark"</p>
      <p>Rules about what clues are valid are up to you, but Pseudonyms will discourage multi-word clues by restricting the use of spaces and prevent the key from giving a clue that exists on the board. </p>

      <h6>The Reveal</h6>
      <p>One the key submits the clue, the other players on the team will have a chance to guess which words the key was trying to hint at. Each team can have as many guesses as they want and can end their turn whenever they want, but if a player guesses incorrectly, i.e. revealing a word that is not their team color, their turn ends. </p>
      <p>If a player reveals the last word for the other team, the other team wins. If a player reveals the black word, they lose.</p>

      <h6>The End</h6>
      <p>The game ends when all of words for one team are revealed. The game can end early if the black word is revealed.</p>

      <button type="button" className="btn btn-light" onClick={props.goBack}>Back</button>
    </div>
  );
}

export default HowTo;