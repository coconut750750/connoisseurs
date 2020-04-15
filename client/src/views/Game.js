import React, { useState, useEffect, useCallback } from 'react';
import debounce from "lodash/debounce";

import GameCodeBadge from '../components/GameCodeBadge';
import PlayerList from '../components/PlayerList';

// import GameHeader from '../game_components/GameHeader';

import Lobby from '../game_views/Lobby';
import Table from '../game_views/Table';
import Results from '../game_views/Results';

import { getMePlayer, newPlayer } from '../models/player';
import ScoreBoard, { newScoreBoard } from '../models/scoreboard';
import BlackCard from '../models/blackcard';

const LOBBY = "lobby";
const SELECTION = "selection";
const REVEAL = "reveal";
const JUDGING = "judging";
const WINNER = "winner";
const RESULTS = "results";

function Game(props) {
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState(LOBBY);

  const [players, setPlayers] = useState([]);
  const [me, setMe] = useState(undefined);

  const [scoreboard, setScoreBoard] = useState(new ScoreBoard());
  const [hand, setHand] = useState([]);
  const [blackcard, setBlack] = useState(new BlackCard());
  const [reveals, setReveals] = useState([]);
  const [winner, setWinner] = useState("");

  const debounceDisappear = () => setMessage("");
  const disappearCallback = useCallback(debounce(debounceDisappear, 5000), []);

  // on mount
  useEffect(() => {
    const reset = () => {
      setScoreBoard(new ScoreBoard());
      setHand([]);
      setBlack(undefined);
      setReveals("");
      setWinner(undefined);
    }

    // this will result in a 'players' message from server
    props.socket.emit('joinGame', { name: props.name, gameCode: props.gameCode });

    props.socket.on('phase', data => {
      setPhase(data.phase);
      if (data.phase === LOBBY) {
        reset();
      }
    });

    props.socket.on('players', data => {
      const players = data.players.map(p => newPlayer(p));
      const mePlayer = getMePlayer(players, props.name);
      setPlayers(players);
      setMe(mePlayer)
    });

    props.socket.on('message', data => {
      setMessage(data.message);
      disappearCallback();
    });

    props.socket.on('winner', data => {
      const { winner } = data;
      setWinner(winner);
    });

    // get data if disconnected
    props.socket.emit('getPhase', {});
    props.socket.emit('getBlack', {});
    props.socket.emit('getRevealed', {});
    props.socket.emit('getWinner', {});
    props.socket.emit('getHand', {});
    props.socket.emit('getPoints', {});
    props.socket.emit('getDeckInfo', {});
    props.socket.emit('getResults', {});

  }, [props.gameCode, props.name, props.socket, disappearCallback]);

  useEffect(() => {
    props.socket.off('reveal');
    props.socket.on('reveal', data => {
      const newReveals = data.reveal;
      setReveals([...reveals, ...newReveals]);
    });
  }, [props.socket, reveals]);

  // const game_views = {
  //   [LOBBY]: <Lobby 
  //             socket={props.socket}
  //             players={players}
  //             me={me}/>,
  // };

  return (
    <div>
      <GameCodeBadge gameCode={props.gameCode}/>
      <br/>

      <PlayerList
        players={players}/>

      {//game_views[phase]
      }

      <div>{ phase }</div>

      <br/>
      {message && <div className="alert alert-danger" role="alert">
        {message}
      </div>}
    </div>
  );
}

export default Game;