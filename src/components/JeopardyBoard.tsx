import { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Clue, GameRound } from "../types";
import "./JeopardyBoard.css";

interface JeopardyBoardProps {
  backToBoard: () => void;
  board: GameRound;
  categoryShown: () => void;
  categoriesShown: number;
  chooseClue: (categoryIndex: number, clueIndex: number) => void;
  currentCategory: number | null;
  currentClue: number | null;
}

function JeopardyBoard(props: JeopardyBoardProps) {
  const {
    backToBoard,
    board,
    categoryShown,
    categoriesShown,
    chooseClue,
    currentCategory,
    currentClue,
  } = props;

  const [solution, setSolution] = useState(false);
  const [dailyDoubleScreenPresented, setDailyDoubleScreenPresented] =
    useState(false);

  useEffect(() => {
    document.addEventListener("keydown", clueKeyPress);
    return () => {
      document.removeEventListener("keydown", clueKeyPress);
    };
  });

  function renderCategory(index: number) {
    return (
      <div onClick={categoryShown} className="category-container">
        <TransitionGroup>
          <CSSTransition key={index} timeout={1000} classNames="categorybox">
            <div className="category-box">
              <div className="category">{board[index].category}</div>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    );
  }

  function renderClue(categoryName: string, clue: Clue, value: number) {
    const showDailyDoubleScreen =
      clue.dailyDouble && !dailyDoubleScreenPresented;
    return (
      <div
        onClick={
          showDailyDoubleScreen
            ? switchDDToClue
            : solution
            ? returnToBoard
            : toggleSolution
        }
        className="clue"
      >
        <div className="clue-category-label">
          {categoryName} - ${clue.value}
        </div>
        <div
          className={
            showDailyDoubleScreen ? "clue-display daily-double" : "clue-display"
          }
        >
          <br />
          {showDailyDoubleScreen ? (
            "Daily Double"
          ) : clue.html === true ? (
            <div
              dangerouslySetInnerHTML={{
                __html: solution ? clue.solution : clue.clue,
              }}
            />
          ) : solution ? (
            clue.solution
          ) : (
            clue.clue
          )}
        </div>
      </div>
    );
  }

  function clueKeyPress(event: KeyboardEvent) {
    // First check for categoriesShown
    if (
      categoriesShown < board.length &&
      (event.key === " " || event.key === "Enter")
    ) {
      categoryShown();
    }

    if (currentCategory === null || currentClue === null) {
      return;
    }
    const clue = board[currentCategory].clues[currentClue];

    if (event.key === " " || event.key === "Enter") {
      // If we just showed the Daily Double screen, switch to the clue
      if (clue.dailyDouble && !dailyDoubleScreenPresented) {
        switchDDToClue();
      } else {
        toggleSolution();
      }
    } else if (event.key === "Escape") {
      returnToBoard();
    }
  }

  function switchDDToClue() {
    setSolution(false);
    setDailyDoubleScreenPresented(true);
  }

  function returnToBoard() {
    setSolution(false);
    setDailyDoubleScreenPresented(false);
    backToBoard();
  }

  function toggleSolution() {
    setSolution(!solution);
  }

  // First check for if we need to present categories
  if (categoriesShown < board.length) {
    return renderCategory(categoriesShown);
  }

  // Check if there is a clue to present
  if (currentCategory !== null && currentClue !== null) {
    return renderClue(
      board[currentCategory].category,
      board[currentCategory].clues[currentClue],
      board[currentCategory].clues[currentClue].value
    );
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            {board.map((category, i) => (
              <td key={i} className="category-title">
                {category.category}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {board[0].clues.map((_, j) => {
            return (
              <tr key={j}>
                {board.map((category, i) => {
                  if (category.clues[j].chosen) {
                    return <td key={i} className="board-clue"></td>;
                  }
                  return (
                    <td
                      key={i}
                      onClick={() => chooseClue(i, j)}
                      className="board-clue"
                    >
                      ${category.clues[j].value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default JeopardyBoard;
