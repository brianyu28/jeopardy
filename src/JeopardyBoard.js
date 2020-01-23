import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './JeopardyBoard.css';


class JeopardyBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      solution: false,
      dailyDoubleScreenPresented: false
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.clueKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.clueKeyPress);
  }

  render() {
    const { board, categoriesShown, currentCategory, currentClue } = this.props;

    // First check for if we need to present categories
    if (categoriesShown < board.length) {
      return this.renderCategory(categoriesShown);
    }

    // Check if there is a clue to present
    if (currentCategory !== null && currentClue !== null) {
      return this.renderClue(
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
                      return (
                        <td key={i} className="board-clue"></td>
                      );
                    }
                    return (
                      <td
                        key={i}
                        onClick={() => this.props.chooseClue(i, j)}
                        className="board-clue">
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

  renderClue(categoryName, clue, value) {
    const showDailyDoubleScreen = clue.dailyDouble && !this.state.dailyDoubleScreenPresented;
    return (
      <div onClick={showDailyDoubleScreen ? this.switchDDToClue : this.state.solution ? this.backToBoard : this.toggleSolution} className="clue">
        <div className="clue-category-label">
          {categoryName} - ${clue.value}
        </div>
        <div className={showDailyDoubleScreen ? "clue-display daily-double" : "clue-display"}>
            <br/>
            {showDailyDoubleScreen ? "Daily Double" : 
             clue.html === true ? <div dangerouslySetInnerHTML={{ __html: this.state.solution ? clue.solution : clue.clue}} /> :
             this.state.solution ? clue.solution : clue.clue}
        </div>
      </div>
    )
  }

  renderCategory(index) {
    const { board } = this.props;
    return (
      <div onClick={this.renderNextCategory} className="category-container">
        <TransitionGroup>
          <CSSTransition
            key={index}
            timeout={1000}
            classNames="categorybox"
          >
            <div className="category-box">
              <div className="category">
                {board[index].category}
              </div>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    );
  }

  clueKeyPress = (event) => {
    const { board, categoriesShown, currentCategory, currentClue } = this.props;

    // First check for categoriesShown
    if (categoriesShown < board.length && (event.key === " " || event.key === "Enter")) {
      this.props.categoryShown();
    }

    if (currentCategory === null || currentClue === null) {
      return;
    }
    const clue = board[currentCategory].clues[currentClue];

    if (event.key === " " || event.key === "Enter") {
      
      // If we just showed the Daily Double screen, switch to the clue
      if (clue.dailyDouble && !this.state.dailyDoubleScreenPresented) {
        this.switchDDToClue();
      } else {
        this.toggleSolution();
      }

    } else if (event.key === "Escape") {
      this.backToBoard();
    }
  }

  renderNextCategory = () => {
    this.props.categoryShown();
  }

  switchDDToClue = () => {
    this.setState({
      dailyDoubleScreenPresented: true,
      solution: false
    });
  }

  backToBoard = () => {
    this.setState({
      solution: false,
      dailyDoubleScreenPresented: false
    });
    this.props.backToBoard();
  }

  toggleSolution = () => {
    this.setState(state => ({
      solution: !state.solution
    }));
  }

}

export default JeopardyBoard;