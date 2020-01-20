import React from 'react';
import './GameLoader.css';

function validateGame(data) {
  const game = data.game;
  if (game === undefined) {
    console.log('Game key not found in JSON payload.');
    return false;
  }
  // TODO: additional validation
  return true;
}

class GameLoader extends React.Component {
  render() {
    return (
      <div className="game-loader">
        <h1>Jeopardy Player</h1>
        <input type="file" name="file" onChange={this.gameLoadedHandler}/>
      </div>
    );
  }

  gameLoadedHandler = (event) => {
    event.target.files[0].text()
         .then(text => {
            const data = JSON.parse(text);
            if (validateGame(data)) {
              this.props.updateGame(data);
            } else {
              console.log("Invalid game.");
            }
         });
  }
}

export default GameLoader;