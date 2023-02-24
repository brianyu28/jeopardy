import { useEffect, useState } from "react";
import { FinalRound } from "../types";

interface FinalJeopardyProps {
  final: FinalRound;
  onFinishGame: () => void;
}

function FinalJeopardy(props: FinalJeopardyProps) {
  const { final, onFinishGame } = props;

  const [category, setCategory] = useState(true);
  const [solution, setSolution] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", clueKeyPress);
    return () => {
      document.removeEventListener("keydown", clueKeyPress);
    };
  });

  function showClue() {
    setCategory(false);
    setSolution(false);
  }

  function toggleSolution() {
    setSolution(!solution);
  }

  function clueKeyPress(event: KeyboardEvent) {
    if (event.key === " " || event.key === "Enter") {
      if (category) {
        showClue();
      } else {
        toggleSolution();
      }
    } else if (event.key === "Escape" && !category && solution) {
      onFinishGame();
    }
  }

  if (category) {
    return (
      <div onClick={showClue} className="clue">
        <div className="clue-display final-category">{final.category}</div>
      </div>
    );
  }
  return (
    <div onClick={solution ? onFinishGame : toggleSolution} className="clue">
      <div className="clue-display">
        {final.html === true ? (
          <div
            dangerouslySetInnerHTML={{
              __html: solution ? final.solution : final.clue,
            }}
          />
        ) : solution ? (
          final.solution
        ) : (
          final.clue
        )}
      </div>
    </div>
  );
}

export default FinalJeopardy;
