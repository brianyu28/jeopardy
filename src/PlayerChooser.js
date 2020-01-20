import React from 'react';
import './PlayerChooser.css';

class PlayerChooser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ''
    }
  }

  render() {
    return (
      <div className="player-chooser">
        <div>
          <h1>Players</h1>
          <ul>
            {this.props.players.map((player, i) => <li key={i}>{player.name}</li>)}
          </ul>
        </div>
        <div>
          <input value={this.state.input} onKeyPress={this.handleKeyPress} onChange={this.inputHandler} autoFocus type="text" placeholder="Player Name" />
          <button className="add-player-button" onClick={this.addPlayer}>Add Player</button>
        </div>
        <div>
          <button className="play-game-button" onClick={this.handlePlayGame}>Play Game</button>
        </div>
      </div>
    );
  }

  addPlayer = () => {
    this.props.addPlayer(this.state.input);
    this.setState({
      input: ''
    });
  }

  handlePlayGame = (event) => {
    this.props.playGame()
  }

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.addPlayer();
    }
  }

  inputHandler = (event) => {
    this.setState({
      input: event.target.value
    });
  }

}

export default PlayerChooser;