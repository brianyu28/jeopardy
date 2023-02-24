import { useState } from "react";

import GameLoader from "./GameLoader";
import PlayerChooser from "./PlayerChooser";
import JeopardyBoard from "./JeopardyBoard";
import Scoreboard from "./Scoreboard";
import FinalJeopardy from "./FinalJeopardy";
import { Game, GameData, GameRound, Player, RoundName } from "../types";

import "./App.css";

function App() {
  const [categoriesShown, setCategoriesShown] = useState(0);
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playing, setPlaying] = useState(false);
  const [round, setRound] = useState<RoundName>("single");
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
  const [currentClue, setCurrentClue] = useState<number | null>(null);

  function updateGame(data: GameData) {
    if (data.players !== undefined) {
      setPlayers(data.players);
    }
    if (data.round !== undefined) {
      setRound(data.round);
    }
    setPlaying(data.players !== undefined);
    setGame(data.game);
  }

  function addPlayer(name: string) {
    setPlayers([...players, { name, score: 0, correct: 0, incorrect: 0 }]);
  }

  function playGame() {
    setPlaying(true);
  }

  function categoryShown() {
    setCategoriesShown(categoriesShown + 1);
  }

  function chooseClue(i: number, j: number) {
    let newGame: Game = Object.assign({}, game);
    let newRound: GameRound = (newGame as any)[round];
    newRound[i].clues[j].chosen = true;
    setGame(newGame);
    setCurrentCategory(i);
    setCurrentClue(j);
  }

  function updateScore(player: number, value: number, correct: boolean) {
    const newPlayers = [...players];
    players[player].score += value;
    if (correct) players[player].correct++;
    else players[player].incorrect++;
    setPlayers(newPlayers);
  }

  function backToBoard() {
    setCurrentClue(null);
    setCurrentCategory(null);
  }

  function proceedToDouble() {
    setCategoriesShown(0);
    setRound("double");
  }

  function proceedToFinal() {
    setRound("final");
  }

  function finishGame() {
    setRound("done");
  }

  function downloadGame() {
    if (game === null) {
      return;
    }
    const element = document.createElement("a");
    const gameData: GameData = { game, players, round };
    const file = new Blob([JSON.stringify(gameData, null, 4)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "game.json";
    document.body.appendChild(element);
    element.click();
  }

  if (game === null) {
    return (
      <div className="app">
        <GameLoader updateGame={updateGame} />
      </div>
    );
  }

  if (!playing) {
    return (
      <div className="app">
        <PlayerChooser
          players={players}
          addPlayer={addPlayer}
          playGame={playGame}
        />
      </div>
    );
  } else if (round === "single" || round === "double") {
    const board = game[round];
    if (board === undefined) {
      return <div>Error: Game board not found.</div>;
    }

    // See if we should be able to proceed to Double Jeopardy
    let allowProceedToDouble = round === "single";
    if (allowProceedToDouble) {
      board.forEach((category) => {
        category.clues.forEach((clue) => {
          if (clue.chosen === undefined) {
            allowProceedToDouble = false;
          }
        });
      });
    }

    let allowProceedToFinal = round === "double";
    if (allowProceedToFinal) {
      board.forEach((category) => {
        category.clues.forEach((clue) => {
          if (clue.chosen === undefined) {
            allowProceedToFinal = false;
          }
        });
      });
    }

    // Allow games configurations to skip Double Jeopardy
    if (allowProceedToDouble && game.double === undefined) {
      allowProceedToDouble = false;
      allowProceedToFinal = true;
    }

    return (
      <div className="app">
        {currentCategory === null &&
          currentClue === null &&
          allowProceedToDouble && (
            <div>
              <button onClick={proceedToDouble} className="proceed-to">
                Proceed to Double Jeopardy
              </button>
            </div>
          )}
        {currentCategory === null &&
          currentClue === null &&
          allowProceedToFinal && (
            <div>
              <button onClick={proceedToFinal} className="proceed-to">
                Proceed to Final Jeopardy
              </button>
            </div>
          )}

        <JeopardyBoard
          board={board}
          backToBoard={backToBoard}
          categoryShown={categoryShown}
          chooseClue={chooseClue}
          categoriesShown={categoriesShown}
          currentCategory={currentCategory}
          currentClue={currentClue}
        />
        <Scoreboard
          players={players}
          currentValue={
            currentCategory !== null && currentClue !== null
              ? board[currentCategory].clues[currentClue].value
              : null
          }
          updateScore={updateScore}
          wagering={
            currentCategory !== null &&
            currentClue !== null &&
            board[currentCategory].clues[currentClue].dailyDouble === true
          }
          stats={false}
        />
        <button onClick={downloadGame} className="download">
          Download Game in Progress
        </button>
      </div>
    );
  } else if (round === "final") {
    const final = game.final;
    return (
      <div>
        <FinalJeopardy final={final} finishGame={finishGame} />
        <Scoreboard
          players={players}
          currentValue={0}
          updateScore={updateScore}
          wagering={true}
          stats={false}
        />
        <button onClick={downloadGame} className="download">
          Download Game in Progress
        </button>
      </div>
    );
  } else if (round === "done") {
    return (
      <div>
        <Scoreboard
          players={players}
          currentValue={null}
          updateScore={updateScore}
          wagering={false}
          stats={true}
        />
        <button onClick={downloadGame} className="download">
          Download Game Result
        </button>
      </div>
    );
  } else {
    return <div>Error: Unknown game round.</div>;
  }
}

export default App;
