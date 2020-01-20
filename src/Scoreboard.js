
import React from 'react';
import './Scoreboard.css';

class Scoreboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wagers: props.players.map(() => "")
    }
  }

  render() {
    const { players } = this.props;
    return (
      <div className="scoreboard">
        {
          players.map((player, i) => this.renderPlayer(player, i))
        }
      </div>
    );
  }

  renderPlayer(player, i) {
    const { currentValue, wagering } = this.props;
    const scoreString = player.score >= 0 ? `$${player.score}` : `-$${-player.score}`;

    const clueValue = currentValue === null ? null :
                      wagering === false ? currentValue :
                      parseInt(this.state.wagers[i]) || 0;
    return (
      <div key={i} className="podium">
        <div className="podium-score">
          {scoreString}
        </div>
        <div className="podium-name">
          {player.name}
        </div>
        {wagering &&
          <div>
            <input
              className="wager-box"
              value={this.state.wagers[i]}
              onChange={(event) => this.changeWager(i, event.target.value)}
            />
          </div>
        }
        {currentValue !== null && 
          <div>
            <button
              onClick={() => this.updateScore(i, -clueValue, false)}
              className="incorrect-answer">
              -${clueValue}
            </button>
            <button
              onClick={() => this.updateScore(i, clueValue, true)}
              className="correct-answer">
               +${clueValue}
            </button>
          </div>
        }
        {
          this.props.stats &&
          <div className="stats">
            <hr />
            <div>Correct: {player.correct}</div>
            <div>Incorrect: {player.incorrect}</div>
          </div>
        }
      </div>
    )
  }

  changeWager = (i, wager) => {
    this.setState(state => {
      const wagers = state.wagers;
      wagers[i] = wager;
      return {wagers};
    });
  }

  updateScore = (i, clueValue, correct) => {
    this.setState(state => {
      const wagers = state.wagers;
      wagers[i] = "";
      return {wagers};
    })
    this.props.updateScore(i, clueValue, correct);
  }

}

export default Scoreboard;