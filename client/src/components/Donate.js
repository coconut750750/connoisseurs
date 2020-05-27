import React from 'react';

import './Donate.css'

export default function Donate(props) {
  return (
    <div>
      <link href="https://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext" rel="stylesheet"/>
      <a className="bmc-button" target="_blank" href="https://www.buymeacoffee.com/brandonwang">
        <img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="Buy me a pizza"/>
        <span>Buy me a pizza</span>
      </a>
    </div>
  );
}