import React from 'react';
import ReactGA from 'react-ga';

import './App.css';

import GameLoader from './GameLoader';
import PlayerChooser from './PlayerChooser';
import JeopardyBoard from './JeopardyBoard';
import Scoreboard from './Scoreboard';
import FinalJeopardy from './FinalJeopardy';

ReactGA.initialize('UA-123778931-2', {
  gaOptions: {
    siteSpeedSampleRate: 100
  }
});
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      categoriesShown: 0,
      game: null,
      players: [],
      playing: false,
      round: "single",
      currentCategory: null,
      currentClue: null
    }
  }

  render() {
    if (this.state.game === null) {
      ReactGA.event({
        category: 'Navigation',
        action: 'Show Game Loader'
      });
      return (
        <div className="app">
          <GameLoader
            updateGame={this.updateGame} 
          />
        </div>
      );
    } else if (!this.state.playing) {
      return (
        <div className="app">
          <PlayerChooser
            players={this.state.players}
            addPlayer={this.addPlayer}
            playGame={this.playGame}
          />
        </div>
      );
    } else if (this.state.round === "single" || this.state.round === "double") {
      const { categoriesShown, currentCategory, currentClue } = this.state;
      const board = this.state.game[this.state.round];
      
      // See if we should be able to proceed to Double Jeopardy
      let allowProceedToDouble = this.state.round === "single";
      if (allowProceedToDouble) {
        board.forEach(category => {
          category.clues.forEach(clue => {
            if (clue.chosen === undefined) {
              allowProceedToDouble = false;
            }
          })
        })
      }

      let allowProceedToFinal = this.state.round === "double";
      if (allowProceedToFinal) {
        board.forEach(category => {
          category.clues.forEach(clue => {
            if (clue.chosen === undefined) {
              allowProceedToFinal = false;
            }
          });
        });
      }

      return (
        <div className="app">
          {currentCategory === null && currentClue === null && allowProceedToDouble &&
            <div>
              <button onClick={this.proceedToDouble} className="proceed-to">
                Proceed to Double Jeopardy
              </button>
            </div>}
          {currentCategory === null && currentClue === null && allowProceedToFinal &&
            <div>
              <button onClick={this.proceedToFinal} className="proceed-to">
                Proceed to Final Jeopardy
              </button>
            </div>}

          <JeopardyBoard
            board={board}
            backToBoard={this.backToBoard}
            categoryShown={this.categoryShown}
            chooseClue={this.chooseClue}
            categoriesShown={categoriesShown}
            currentCategory={currentCategory}
            currentClue={currentClue}
          />
          <Scoreboard
            players={this.state.players}
            currentValue={currentCategory !== null && currentClue !== null ? board[currentCategory].clues[currentClue].value : null}
            updateScore={this.updateScore}
            wagering={currentCategory !== null && currentClue !== null && board[currentCategory].clues[currentClue].dailyDouble === true}
            stats={false}
          />
          <button onClick={this.downloadGame} className="download">Download Game in Progress</button>
        </div>
      )
    } else if (this.state.round === "final") {
      const final = this.state.game.final;
      return (
        <div>
          <FinalJeopardy
            final={final}
            finishGame={this.finishGame}
          />
          <Scoreboard
            players={this.state.players}
            currentValue={0}
            updateScore={this.updateScore}
            wagering={true}
            stats={false}
          />
          <button onClick={this.downloadGame} className="download">Download Game in Progress</button>
        </div>
      );
    } else if (this.state.round === "done") {
      return (
        <div>
          <Scoreboard
            players={this.state.players}
            currentValue={null}
            updateScore={this.updateScore}
            wagering={false}
            stats={true}
          />
          <button onClick={this.downloadGame} className="download">Download Game Result</button>
        </div>
      );
    }
  }

  addPlayer = (name) => {
    ReactGA.event({
      category: 'Game',
      action: 'Add Player',
      label: name
    });
    this.setState(state => ({
      players: [...state.players, {name: name, score: 0, correct: 0, incorrect: 0}]
    }));
  }

  categoryShown = () => {
    ReactGA.event({
      category: 'Game',
      action: 'Show Category',
      label: `${this.state.round}: ${this.state.game[this.state.round][this.state.categoriesShown].name}`
    });
    this.setState(state => ({
      categoriesShown: state.categoriesShown + 1
    }));
  }

  chooseClue = (i, j) => {
    ReactGA.event({
      category: 'Game',
      action: 'Show Clue',
      label: `${this.state.round}: ${this.state.game[this.state.round][i].clues[j].clue} (${this.state.game[this.state.round][i].clues[j].solution})`
    });
    this.setState(state => {
      let game = Object.assign({}, state.game);
      let round = game[state.round];
      round[i].clues[j].chosen = true;
      return {
        game: game,
        currentCategory: i,
        currentClue: j
      };
    })
  }

  backToBoard = () => {
    ReactGA.event({
      category: 'Game',
      action: 'Back to Board'
    });
    this.setState({
      currentCategory: null,
      currentClue: null
    })
  }

  downloadGame = () => {
    ReactGA.event({
      category: 'Game',
      action: 'Download Game',
      label: this.state.round
    });
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify({
      game: this.state.game,
      players: this.state.players,
      round: this.state.round
    }, null, 4)], {type: "text/plain"});
    element.href = URL.createObjectURL(file);
    element.download = "game.json";
    document.body.appendChild(element);
    element.click();
  }

  finishGame = () => {
    ReactGA.event({
      category: 'Game',
      action: 'Finish Game'
    });
    this.setState({
      round: "done"
    });
  }

  playGame = () => {
    ReactGA.event({
      category: 'Game',
      action: 'Play Game'
    });
    this.setState({
      playing: true
    })
  }

  proceedToDouble = () => {
    ReactGA.event({
      category: 'Game',
      action: 'Proceed to Double Jeopardy'
    });
    this.setState({
      categoriesShown: 0,
      round: "double"
    });
  }

  proceedToFinal = () => {
    ReactGA.event({
      category: 'Game',
      action: 'Proceed to Final Jeopardy'
    });
    this.setState({
      round: "final"
    });
  }

  updateGame = (data) => {
    const categories = data.game.single.map(c => c.category).concat(data.game.double.map(c => c.category)).concat([data.game.final.category]).join(" - ").slice(0, 499)
    ReactGA.event({
      category: 'Game',
      action: 'Upload Game',
      label: categories
    });
    this.setState(state => ({
      game: data.game,
      players: data.players !== undefined ? data.players : state.players,
      round: data.round !== undefined ? data.round : state.round,
      playing: data.players !== undefined
    }));
  }

  updateScore = (player, value, correct) => {
    ReactGA.event({
      category: 'Game',
      action: 'Update Score',
      label: `${player} ${correct ? 'correct' : 'incorrect'} (${value})`
    });
    this.setState(state => {
      const players = [...state.players];
      players[player].score += value;
      if (correct)
        players[player].correct++;
      else
        players[player].incorrect++;
      return {players};
    });
  }

}

export default App;
