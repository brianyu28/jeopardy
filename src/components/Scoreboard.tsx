import React, { useState } from "react";
import { Player } from "../types";
import "./Scoreboard.css";

/**
class Scoreboard extends React.Component {

}
*/

interface ScoreboardProps {
  // The value of the current clue on the board
  currentValue: number | null;
  players: Player[];
  stats: boolean;
  updateScore: (i: number, clueValue: number, correct: boolean) => void;
  wagering: boolean;
}

function Scoreboard(props: ScoreboardProps) {
  const { currentValue, players, stats, updateScore, wagering } = props;

  const [wagers, setWagers] = useState<string[]>(() => {
    return players.map(() => "");
  });

  function renderPlayer(player: Player, i: number) {
    const scoreString =
      player.score >= 0 ? `$${player.score}` : `-$${-player.score}`;

    const clueValue: number | null =
      currentValue === null
        ? null
        : wagering === false
        ? currentValue
        : parseInt(wagers[i]) || 0;
    return (
      <div key={i} className="podium">
        <div className="podium-score">{scoreString}</div>
        <div className="podium-name">{player.name}</div>
        {wagering && (
          <div>
            <input
              className="wager-box"
              value={wagers[i]}
              onChange={(event) => changeWager(i, event.target.value)}
            />
          </div>
        )}
        {currentValue !== null && clueValue !== null && (
          <div>
            <button
              onClick={() => updateScoreboardScore(i, -clueValue, false)}
              className="incorrect-answer"
            >
              -${clueValue}
            </button>
            <button
              onClick={() => updateScoreboardScore(i, clueValue, true)}
              className="correct-answer"
            >
              +${clueValue}
            </button>
          </div>
        )}
        {stats && (
          <div className="stats">
            <hr />
            <div>Correct: {player.correct}</div>
            <div>Incorrect: {player.incorrect}</div>
          </div>
        )}
      </div>
    );
  }

  function changeWager(i: number, wager: string) {
    setWagers(
      wagers.map((existingWager, wagerIndex) =>
        wagerIndex === i ? wager : existingWager
      )
    );
  }

  function updateScoreboardScore(
    i: number,
    clueValue: number,
    correct: boolean
  ) {
    setWagers(
      wagers.map((existingWager, wagerIndex) =>
        wagerIndex === i ? "" : existingWager
      )
    );
    updateScore(i, clueValue, correct);
  }

  return (
    <div className="scoreboard">
      {players.map((player, i) => renderPlayer(player, i))}
    </div>
  );
}

export default Scoreboard;
