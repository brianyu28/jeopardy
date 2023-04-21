import React, { ChangeEvent } from "react";

import { GameData } from "../types";
import sample_game from "../assets/sample_game.json";
import { logEvent } from "../util/analytics";

import "./GameLoader.css";

interface GameLoaderProps {
  updateGame: (game: GameData) => void;
}

function GameLoader(props: GameLoaderProps) {
  const { updateGame } = props;

  function validateGame(data: any): GameData | null {
    const game = data.game;
    if (game === undefined) {
      console.log("Game key not found in JSON payload.");
      return null;
    }
    // TODO: additional validation
    return game;
  }

  function handleGameUpload(event: ChangeEvent<HTMLInputElement>) {
    logEvent("Upload Game");
    if (event.target.files === null) {
      return;
    }
    event.target.files[0].text().then((text) => {
      const data: any = JSON.parse(text);
      const game = validateGame(data);
      if (game !== null) {
        updateGame(data);
      } else {
        console.log("Invalid game.");
      }
    });
  }

  function downloadSampleGame() {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(sample_game, null, 4)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "sample_game.json";
    document.body.appendChild(element);
    element.click();
  }

  return (
    <div className="game-loader">
      <h1>Jeopardy Player</h1>
      <p>Designed by Brian Yu</p>
      <hr />
      <h2>Play a Game</h2>
      <input type="file" name="file" onChange={handleGameUpload} />
      <hr />
      <h2>Create a Game</h2>
      <div className="create-your-own">
        To create a Jeopardy game, download the below game configuration file,
        edit it to include your desired clues, and re-upload it here.
        <div>
          <button onClick={downloadSampleGame}>Download Configuration</button>
        </div>
      </div>
    </div>
  );
}

export default GameLoader;
