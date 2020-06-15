import React, { useState, useEffect, useCallback } from 'react';
import debounce from "lodash/debounce";

import GameCodeBadge from '../components/GameCodeBadge';

import Lobby from '../game_views/Lobby';
import Table from '../game_views/Table';
import Results from '../game_views/Results';

import { getMePlayer, newPlayer } from '../models/player';
import ScoreBoard from '../models/scoreboard';
import BlackCard from '../models/blackcard';
import { parseWhiteCardList } from '../models/whitecard';
import ResultsModel from '../models/results';
import HandModel from '../models/hand';
import DeckInfo from '../models/deckinfo';

const LOBBY = "lobby";
const SELECTION = "selection";
const REVEAL = "reveal";
const JUDGING = "judging";
const WINNER = "winner";
const RESULTS = "results";

export default function Game(props) {
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState(LOBBY);

  const [players, setPlayers] = useState([]);
  const [me, setMe] = useState(undefined);

  const [scoreboard, setScoreBoard] = useState(new ScoreBoard());
  const [hand, setHand] = useState(new HandModel());
  const [played, setPlayed] = useState([]);
  const [blackcard, setBlack] = useState(new BlackCard(0, "", 0));
  const [ready, setReady] = useState([]);
  const [deckinfo, setDeckInfo] = useState(new DeckInfo());
  const [reveals, setReveals] = useState([]);
  const [winner, setWinner] = useState("");
  const [winCards, setWinCards] = useState([]);
  const [results, setResults] = useState(new ResultsModel());

  const debounceDisappear = () => setMessage("");
  const disappearCallback = useCallback(debounce(debounceDisappear, 3000), []);
  const setDisappearingMessage = useCallback((string, cssClass) => {
    setMessage({ string, class: cssClass });
    disappearCallback();
  }, [disappearCallback]);
  // on mount
  useEffect(() => {
    const resetRound = () => {
      setPlayed([]);
      setBlack(new BlackCard(0, "", 0));
      setReveals([]);
      setWinner("");
      setWinCards([]);
    }

    const reset = () => {
      setScoreBoard(new ScoreBoard());
      setResults(new ResultsModel());
      setHand(new HandModel());
      resetRound();
      setDeckInfo(new DeckInfo());
    };

    // this will result in a 'players' message from server
    props.socket.emit('joinGame', { name: props.name, gameCode: props.gameCode });

    props.socket.on('phase', data => {
      setPhase(data.phase);
      if (data.phase === LOBBY) {
        reset();
      } else if (data.phase === SELECTION) {
        resetRound();
      }
    });

    props.socket.on('players', data => {
      const players = data.players.map(p => newPlayer(p));
      const mePlayer = getMePlayer(players, props.name);
      setPlayers(players);
      setMe(mePlayer)
    });

    props.socket.on('message', data => {
      setDisappearingMessage(data.message, 'alert-danger');
    });

    props.socket.on('black', data => {
      const { card } = data;
      setBlack(new BlackCard(card.id, card.text, card.blanks));
    });

    props.socket.on('deck', data => {
      const { deck } = data;
      setDeckInfo(new DeckInfo(deck));
    });

    props.socket.on('hand', data => {
      const { cards, swaps } = data;
      const cardlist = parseWhiteCardList(cards);
      setHand(new HandModel(cardlist, swaps));
    });

    props.socket.on('played', data => {
      const { cards } = data;
      setPlayed(parseWhiteCardList(cards));
    });

    props.socket.on('ready', data => {
      const { names } = data;
      setReady(names);
    });

    props.socket.on('revealed', data => {
      const { revealed } = data;
      let reveals = [];
      for (let stack of revealed) {
        reveals.push(parseWhiteCardList(stack));
      }
      setReveals(reveals);
    });

    props.socket.on('win', data => {
      const { winner, cards } = data;
      setWinner(winner);
      setWinCards(parseWhiteCardList(cards));
    });

    props.socket.on('points', data => {
      const { points } = data;
      setScoreBoard(new ScoreBoard(points));
    });

    props.socket.on('results', data => {
      const { points } = data;
      setResults(new ResultsModel(new ScoreBoard(points)));
    });

    props.socket.emit('getReconnect', {});

  }, [props.gameCode, props.name, props.socket, setDisappearingMessage]);

  return (
    <div id="game">
      <GameCodeBadge 
        gameCode={props.gameCode}
        copySuccess={() => setDisappearingMessage('Successfully copied shareable link!', 'alert-success')}/>

      {phase === LOBBY &&
        <Lobby
          socket={props.socket}
          players={players}
          me={me}/>
      }
      {[SELECTION, REVEAL, JUDGING, WINNER].includes(phase) &&
        <Table
          phase={phase}
          socket={props.socket}
          players={players}
          ready={ready}
          me={me}
          scoreboard={scoreboard}
          deckinfo={deckinfo}
          blackcard={blackcard}
          hand={hand}
          played={played}
          reveals={reveals}
          winCards={winCards}
          winner={winner}/>
      }
      {phase === RESULTS &&
        <Results
          socket={props.socket}
          players={players}
          results={results}/>
      }

      <br/>
      {message && <div className={`message alert ${message.class}`} role="alert">
        {message.string}
      </div>}
    </div>
  );
}
