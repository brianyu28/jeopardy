import { ChangeEvent, KeyboardEvent, useState } from "react";

import { Player } from "../types";

import "./PlayerChooser.css";

interface PlayerChooserProps {
  addPlayer: (name: string) => void;
  players: Player[];
  playGame: () => void;
}

function PlayerChooser(props: PlayerChooserProps) {
  const { addPlayer: addPlayerByName, playGame, players } = props;
  const [name, setName] = useState("");

  function addPlayer() {
    addPlayerByName(name);
    setName("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      addPlayer();
    }
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  return (
    <div className="player-chooser">
      <div>
        <h1>Players</h1>
        <ul>
          {players.map((player, i) => (
            <li key={i}>{player.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <input
          value={name}
          onKeyDown={handleKeyDown}
          onChange={handleNameChange}
          autoFocus
          type="text"
          placeholder="Player Name"
        />
        <button className="add-player-button" onClick={addPlayer}>
          Add Player
        </button>
      </div>
      <div>
        <button className="play-game-button" onClick={playGame}>
          Play Game
        </button>
      </div>
    </div>
  );
}

export default PlayerChooser;
