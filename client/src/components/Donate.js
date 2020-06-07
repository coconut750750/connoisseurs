import React from 'react';

import './Donate.css'

export default function Donate(props) {
  return (
    <div>
      <link href="https://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext" rel="stylesheet"/>
      <a className="bmc-button" target="_blank" rel="noopener noreferrer" href="https://www.buymeacoffee.com/brandonwang">
        <span role="img" aria-label="pizza">🍕</span> <span>Buy me a pizza</span>
      </a>
    </div>
  );
}