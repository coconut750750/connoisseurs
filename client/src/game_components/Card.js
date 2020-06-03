import React from 'react';

import "./Card.css"

export default function Card(props) {
  const getDisplayClass = () => {
    const toggled = props.toggled ? "toggled" : "";
    const active = props.active ? "active" : "";
    const heightClass = props.short ? "short" : "";
    return `card ${props.color} ${toggled} ${active} ${heightClass}`;
  };

  const italicize = text => {
    const firstSplit = text.split('<i>');
    let res = [firstSplit[0]];
    firstSplit.slice(1).forEach(item => {
      const split = item.split('</i>');
      res.push(<i>{split[0]}</i>);
      res.push(split[1]);
    });
    return res;
  };

  const processText = text => {
    const split = text.split('\n');
    let components = italicize(split[0]);
    split.slice(1).forEach(item => {
      components.push(<br/>);
      components = components.concat(italicize(item));
    });
    return components;
  };

  const getTextClass = text => {
    if (text === undefined || text.length < 75) {
      return "large";
    } else if (text.length < 150) {
      return "medium";
    } else if (text.length < 200) {
      return "small";
    } else {
      return "xs";
    }
  };

  return (
    <div className={getDisplayClass()}  onClick={ () => { if (props.onClick !== undefined) props.onClick(props.card); } }>
      <div className="card-body">
        <h6 className={`text-left ${getTextClass(props.card?.text)}`}>{processText(props.card?.text)}</h6>
      </div>
    </div>
  );
}